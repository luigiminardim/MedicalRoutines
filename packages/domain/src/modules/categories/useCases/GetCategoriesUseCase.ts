import { Category } from "../entities/Category";

export interface IGetCategoriesGateway {
  getCategories(): Promise<Array<Category>>;
}

export class GetCategoriesUseCase {
  constructor(private categoriesGateway: IGetCategoriesGateway) {}

  public async getCategories(): Promise<Array<Category>> {
    const categories = this.categoriesGateway.getCategories();
    return categories;
  }
}
