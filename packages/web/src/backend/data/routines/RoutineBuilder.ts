import { Routine } from "monorepo-domain";
import { GetPageResponse } from "@notionhq/client/build/src/api-endpoints";

export class PageBuilder {
  buildPage(page: GetPageResponse): Routine {
    const nameProperty = page.properties["name"];
    if (nameProperty?.type !== "title")
      throw Error(`Invalid routine page title. Routine id: ${page.id}`);
    const name = nameProperty.title.map((text) => text.plain_text).join();

    const slugProperty = page.properties["slug"];
    if (slugProperty?.type !== "rich_text")
      throw Error(`Invalid routine page slug. Routine id: ${page.id}`);
    const slug = slugProperty.rich_text.map((text) => text.plain_text).join();

    const tagsProperty = page.properties["tags"];
    if (tagsProperty?.type !== "multi_select")
      throw Error(`Invalid routine tags property. ${page.id}`);
    const tags = tagsProperty.multi_select.map((select) => select.name);

    return {
      id: page.id,
      slug: slug,
      name,
      categories: [],
      tags,
      sections: [],
    };
  }
}
