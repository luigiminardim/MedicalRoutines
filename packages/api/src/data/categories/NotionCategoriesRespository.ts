import { Client as NotionClient } from "@notionhq/client";
import { Category, IGetCategoriesGateway } from "@monorepo/domain";
import { GetPageResponse } from "@notionhq/client/build/src/api-endpoints";

export class NotionCategoriesRepository implements IGetCategoriesGateway {
  constructor(private client: NotionClient) {}

  private buildCategory(page: GetPageResponse): Category {
    const nameProperty = page.properties["name"];
    if (nameProperty?.type !== "title")
      throw Error(`Invalid category page title. Category id: ${page.id}`);
    const name = nameProperty.title.map((text) => text.plain_text).join();

    const slugProperty = page.properties["slug"];
    if (slugProperty?.type !== "rich_text")
      throw Error(`Invalid category page slug. Category id: ${page.id}`);
    const slug = slugProperty.rich_text.map((text) => text.plain_text).join();

    const colorThemeProperty = page.properties["color_theme"];
    if (colorThemeProperty?.type !== "rich_text")
      throw Error(`Invalid routine color_theme. Category id: ${page.id}`);
    const colorTheme = colorThemeProperty.rich_text
      .map((text) => text.plain_text)
      .join();

    return {
      id: slug,
      name: name,
      colorTheme,
    };
  }

  async getCategory(categoryNotionId: Category["id"]): Promise<Category> {
    const categoryPage = await this.client.pages.retrieve({
      page_id: categoryNotionId,
    });
    const category = this.buildCategory(categoryPage);
    return category;
  }

  async getCategories(): Promise<Category[]> {
    const categoriesDatabaseId = "5ebe390563ab448aaec237febf1bb98d";
    const categoriesQuery = await this.client.databases.query({
      database_id: categoriesDatabaseId,
    });
    const categories = categoriesQuery.results.map((categoryPage) =>
      this.buildCategory(categoryPage)
    );
    return categories;
  }
}
