import { Client as NotionClient } from "@notionhq/client";
import { Category, ICategoriesRepository } from "@monorepo/domain";
import { GetPageResponse } from "@notionhq/client/build/src/api-endpoints";

export class NotionCategoriesRepository implements ICategoriesRepository {
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
      id: page.id,
      name: name,
      slug: slug,
      colorTheme,
    };
  }

  async getCategories(): Promise<Category[]> {
    throw new Error("Method not implemented.");
  }

  async getCategory(categoryId: Category["id"]): Promise<Category> {
    const categoryPage = await this.client.pages.retrieve({
      page_id: categoryId,
    });
    const category = this.buildCategory(categoryPage);
    return category;
  }
}