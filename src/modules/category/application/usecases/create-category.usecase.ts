/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Inject } from '@nestjs/common';
import slug from 'slug';
import { Category } from '../../domain/entities/category.entity';
import {
  CATEGORY_REPOSITORY,
  CategoryRepository,
} from '../../domain/repositories/category.repository';
export class CreateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly repo: CategoryRepository,
  ) {}

  async execute(name: string) {
    const entity = new Category(crypto.randomUUID(), name, slug(name), '');

    await this.repo.save(entity);

    return entity;
  }
}
