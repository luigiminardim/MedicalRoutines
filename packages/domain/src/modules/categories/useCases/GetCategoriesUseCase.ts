import { ICategoriesRepository } from "./../interfaces/ICategoriesRepository";
import { Category } from "../entities/Category";

export class GetCategoriesUseCase {
  constructor(private categoriesRepository: ICategoriesRepository) {}

  public async getCategories(): Promise<Array<Category>> {
    const categories = this.categoriesRepository.getCategories();
    return categories;
  }
}
