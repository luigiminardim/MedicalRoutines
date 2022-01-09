import { Organization } from "../../organizations";
import { Category } from "../entities/Category";

export type GetCategoriesDtoInput = {
  organizationSlug: Organization["slug"];
};

export interface IGetCategoriesGateway {
  getCategories(input: GetCategoriesDtoInput): Promise<Array<Category>>;
}

export class GetCategoriesUseCase {
  constructor(private categoriesGateway: IGetCategoriesGateway) {}

  public async getCategories(
    input: GetCategoriesDtoInput
  ): Promise<Array<Category>> {
    const categories = this.categoriesGateway.getCategories({
      organizationSlug: input.organizationSlug,
    });
    return categories;
  }
}
