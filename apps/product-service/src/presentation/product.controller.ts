import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateProductCommand } from '../application/commands/create-product.command';
import { getProductQuery } from '../application/queries/get-product.query';

@Controller('products')
export class ProductController {
  constructor(
    private readonly createProductCommand: CreateProductCommand,
    private readonly getProductQuery: getProductQuery,
  ) {}

  @Post()
  create(@Body() data: any) {
    return this.createProductCommand.execute(data);
  }

  @Get()
  getAll() {
    return this.getProductQuery.execute();
  }
}
