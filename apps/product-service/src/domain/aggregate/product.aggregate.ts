/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { AggregateRoot } from 'shared/aggregate/aggregate-root';
import { ProductCreatedEvent } from 'shared/events/product-created.event';

export class Product extends AggregateRoot {
  constructor(
    public readonly id: string,
    public name: string,
    public price: number,
  ) {
    super();
  }

  static create({ name, price }) {
    const product = new Product(crypto.randomUUID(), name, price);

    product.addEvent(
      new ProductCreatedEvent(product.id, product.name, product.price),
    );

    return product;
  }
}
