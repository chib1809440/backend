import { Module } from '@nestjs/common';
import { CreateCategoryUseCase } from './application/usecases/create-category.usecase';
import { GetAllCategoryUseCase } from './application/usecases/get-all-category.usecase';
import { CATEGORY_REPOSITORY } from './domain/repositories/category.repository';
import { CategoryPrismaRepository } from './infrastructure/persistence/category.prisma.repository';
import { CategoryController } from './presentation/category.controller';

@Module({
  controllers: [CategoryController],
  providers: [
    CreateCategoryUseCase,
    GetAllCategoryUseCase,
    {
      provide: CATEGORY_REPOSITORY,
      useClass: CategoryPrismaRepository,
    },
  ],
})
export class CategoryModule {}
