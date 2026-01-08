import { Inject } from '@nestjs/common';
import { Category } from '../../domain/entities/category.entity';
import {
  CATEGORY_REPOSITORY,
  CategoryRepository,
} from '../../domain/repositories/category.repository';

export class GetAllCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly repo: CategoryRepository,
  ) {}

  async execute(): Promise<Category[]> {
    const rows = await this.repo.getAll();

    return rows;
  }
}
