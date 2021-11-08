"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createCartItem = createCartItem;
function createCartItem(product, quantity) {
    return {
        product: product,
        quantity: quantity,
        getTotal: function() {
            return this.product.price * this.quantity;
        }
    };
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbnRpdHkvQ2FydEl0ZW0udHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUHJvZHVjdCB9IGZyb20gXCIuL1Byb2R1Y3RcIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ2FydEl0ZW0ge1xyXG4gIGlkPzogbnVtYmVyO1xyXG4gIHByb2R1Y3Q6IFByb2R1Y3Q7XHJcbiAgcXVhbnRpdHk6IG51bWJlcjtcclxuICBnZXRUb3RhbCgpOiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDYXJ0SXRlbShwcm9kdWN0OiBQcm9kdWN0LCBxdWFudGl0eTogbnVtYmVyKTogQ2FydEl0ZW0ge1xyXG4gIHJldHVybiB7XHJcbiAgICBwcm9kdWN0LFxyXG4gICAgcXVhbnRpdHksXHJcbiAgICBnZXRUb3RhbCgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMucHJvZHVjdC5wcmljZSAqIHRoaXMucXVhbnRpdHk7XHJcbiAgICB9LFxyXG4gIH07XHJcbn1cclxuIl0sIm5hbWVzIjpbImNyZWF0ZUNhcnRJdGVtIiwicHJvZHVjdCIsInF1YW50aXR5IiwiZ2V0VG90YWwiLCJwcmljZSJdLCJtYXBwaW5ncyI6Ijs7OztRQVNnQkEsY0FBYyxHQUFkQSxjQUFjO1NBQWRBLGNBQWMsQ0FBQ0MsT0FBZ0IsRUFBRUMsUUFBZ0IsRUFBWSxDQUFDO0lBQzVFLE1BQU0sQ0FBQyxDQUFDO1FBQ05ELE9BQU8sRUFBUEEsT0FBTztRQUNQQyxRQUFRLEVBQVJBLFFBQVE7UUFDUkMsUUFBUSxFQUFSQSxRQUFRLEdBQUcsQ0FBQztZQUNWLE1BQU0sQ0FBQyxJQUFJLENBQUNGLE9BQU8sQ0FBQ0csS0FBSyxHQUFHLElBQUksQ0FBQ0YsUUFBUTtRQUMzQyxDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUMifQ==