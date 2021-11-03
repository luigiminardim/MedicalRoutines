import { ICategoryRepository } from "./../interfaces/ICategoryRepository";
import { Category } from "../entities/Category";

export class GetCategoriesUseCase {
  constructor(private categoriesRepository: ICategoryRepository) {}

  public async getCategories(): Promise<Array<Category>> {
    const categories = this.categoriesRepository.getCategories();
    return categories;
  }
}
