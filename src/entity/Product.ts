export class Product {
  private name: string;
  private price: number;
  // private description: string;
  // private image: string;
  // private category: Category;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    name: string,
    price: number,
    // description: string,
    // image: string,
    // category: Category,
  ) {
    this.name = name;
    this.price = price;
    // this.description = description;
    // this.image = image;
    // this.category = category;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public getName(): string {
    return this.name;
  }

  public getPrice(): number {
    return this.price;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public setPrice(price: number): void {
    this.price = price;
  }
}

class Category {
  private id: number;
  private name: string;
}