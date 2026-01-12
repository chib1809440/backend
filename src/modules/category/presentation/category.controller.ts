import { Body, Controller, Get, Post } from '@nestjs/common';
import { ServiceName } from 'src/shared/logger/decorators/service-name.decorator';
import { CreateCategoryDto } from '../application/dtos/create-category.dto';
import { CreateCategoryUseCase } from '../application/usecases/create-category.usecase';
import { GetAllCategoryUseCase } from '../application/usecases/get-all-category.usecase';

@Controller('categories')
@ServiceName('categories-service')
export class CategoryController {
  constructor(
    private readonly createCategory: CreateCategoryUseCase,
    private readonly getAllCategory: GetAllCategoryUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateCategoryDto) {
    return await this.createCategory.execute(dto.name);
  }

  @Get()
  async getAll() {
    return await this.getAllCategory.execute();
  }
}
