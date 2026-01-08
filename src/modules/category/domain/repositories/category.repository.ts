import { Category } from '../entities/category.entity';

export abstract class CategoryRepository {
  abstract save(entity: Category): Promise<void>;
  abstract getAll(): Promise<Category[]>;
}

export const CATEGORY_REPOSITORY = Symbol('CATEGORY_REPOSITORY');
