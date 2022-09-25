import { Order as PrismaOrder, OrderItem as PrismaOrderItem, OrderStatus as PrismaOrderStatus, PrismaClient, Product as PrismaProduct, User as PrismaUser } from '@prisma/client';
import { OrderGateway } from "../../application/ports";
import { getOrderItemSubtotal, Order, OrderStatus } from "../../domain/order";

type PrismaOrderFullyIncluded = PrismaOrder & {
  user: PrismaUser;
  orderItems: (PrismaOrderItem & {
    product: PrismaProduct;
  })[];
  status: PrismaOrderStatus
};

export function createOrderAdapter(prisma: PrismaClient): OrderGateway {
  return {
    async save(order) {
      const status = await prisma.orderStatus.findFirst({
        where: {
          name: order.status,
        },
      });

      if (!status) {
        throw new Error(`Order status ${order.status} not found`);
      }

      const orderItemsSummarized = order.items.map((item) => ({
        ...item,
        subtotal: getOrderItemSubtotal(item),
      }));

      const total = orderItemsSummarized.reduce((acc, item) => acc + item.subtotal, 0);

      // if order is new, create it
      if (order.id === undefined) {
        const newOrder = await prisma.order.create({
          data: {
            user: { connect: { id: order.user.id } },
            orderItems: {
              create: orderItemsSummarized.map((item) => ({
                product: { connect: { id: item.product.id } },
                quantity: item.quantity,
                subtotal: item.subtotal,
              })),
            },
            status: { connect: { id: status.id } },
            total,
          },
          include: {
            user: true,
            orderItems: {
              include: {
                product: true,
              },
            },
            status: true,
          }
        });

        return mapPrismaOrderFullyIncludedToDomain(newOrder);
      }

      // otherwise, update it
      // * order's updatable fields are: status
      // * order item's updatable fields are: quantity, subtotal
      const existingOrder = await prisma.order.findFirst({
        where: {
          id: order.id
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          status: true,
        }
      });

      if (!existingOrder) {
        throw new Error(`Order ${order.id} not found`);
      }

      const existingOrderItems = existingOrder.orderItems;
      const existingOrderItemsIds = existingOrderItems.map((item) => item.id);
      const newOrderItemsIds = orderItemsSummarized.map((item) => item.id);

      // FIXME: plain old for loop MIGHT be faster
      const orderItemsToUpdate = orderItemsSummarized.filter((item) => item.id && existingOrderItemsIds.includes(item.id))
      const orderItemsToCreate = orderItemsSummarized.filter((item) => item.id && !existingOrderItemsIds.includes(item.id));
      const orderItemsToDelete = existingOrderItems.filter((item) => item.id && !newOrderItemsIds.includes(item.id));

      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          orderItems: {
            update: orderItemsToUpdate.map((item) => {
              const existingItem = existingOrderItems.find((existingItem) => existingItem.id === item.id);

              return {
                where: {
                  id: item.id,
                },
                data: {
                  quantity: item.quantity === existingItem?.quantity
                    ? undefined
                    : item.quantity,
                  subtotal: item.subtotal === existingItem?.subtotal.toNumber()
                    ? undefined
                    : item.subtotal,
                },
              }
            }),
            create: orderItemsToCreate.map((item) => ({
              product: { connect: { id: item.product.id } },
              quantity: item.quantity,
              subtotal: item.subtotal,
            })),
            delete: orderItemsToDelete.map((item) => ({ id: item.id })),
          },
          status: order.status === existingOrder.status.name
            ? undefined
            : { connect: { id: status.id } },
        },
        include: {
          user: true,
          orderItems: {
            include: {
              product: true,
            },
          },
          status: true,
        }
      });

      return mapPrismaOrderFullyIncludedToDomain(updatedOrder);
    },

    async findById(id) {
      const order = await prisma.order.findFirst({
        where: {
          id,
        },
        include: {
          user: true,
          orderItems: {
            include: {
              product: true,
            },
          },
          status: true,
        }
      });

      if (!order) {
        return null;
      }

      return mapPrismaOrderFullyIncludedToDomain(order);
    },

    async findByOwnerId(ownerId) {
      const orders = await prisma.order.findMany({
        where: {
          user: {
            id: ownerId,
          },
        },
        include: {
          user: true,
          orderItems: {
            include: {
              product: true,
            },
          },
          status: true,
        }
      });

      return orders.map((order) => mapPrismaOrderFullyIncludedToDomain(order));
    },

  }
}

function mapPrismaOrderFullyIncludedToDomain(prismaOrder: PrismaOrderFullyIncluded): Order {
  return {
    id: prismaOrder.id,
    user: prismaOrder.user,
    items: prismaOrder.orderItems.map((item) => ({
      id: item.id,
      product: {
        id: item.product.id,
        name: item.product.name,
        price: item.product.price.toNumber(),
      },
      quantity: item.quantity,
    })),
    status: prismaOrder.status.name as OrderStatus,
  };
}
