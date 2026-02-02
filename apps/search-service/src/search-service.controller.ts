/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { Controller, Get, Query } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { SearchService } from './search-service.service';

@Controller()
export class SearchServiceController {
  constructor(private readonly searchService: SearchService) {}

  @MessagePattern('PRODUCT_QUEUE.PRODUCT_CREATED')
  handle(@Payload() data: any, @Ctx() ctx: RmqContext) {
    console.log('🚀 ~ SearchServiceController ~ handle ~ ctx:', ctx);
    this.searchService.createProduct(data);
    return true;
  }

  @Get()
  async getProduct(@Query('keyword') keyword: string) {
    return await this.searchService.search(keyword);
  }
}
