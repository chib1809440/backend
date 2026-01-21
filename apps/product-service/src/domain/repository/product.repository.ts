export interface IProductRepository {
  findAll(): Promise<any>;
  create(data: any): Promise<void>;
}

export const PRODUCT_REPOSITORY_TOKEN = Symbol('PRODUCT_REPOSITORY_TOKEN');
