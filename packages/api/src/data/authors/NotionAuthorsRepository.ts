import { Client as NotionClient } from "@notionhq/client";
import { Author, IAuthorsRepository } from "@monorepo/domain";
import { GetPageResponse } from "@notionhq/client/build/src/api-endpoints";

export class NotionAuthorsRepository implements IAuthorsRepository {
  constructor(private client: NotionClient) {}

  private buildAuthor(page: GetPageResponse): Author {
    const nameProperty = page.properties["name"];
    if (nameProperty?.type !== "title")
      throw Error(`Invalid author page title. Author id: ${page.id}`);
    const name = nameProperty.title.map((text) => text.plain_text).join();

    const slugProperty = page.properties["slug"];
    if (slugProperty?.type !== "rich_text")
      throw Error(`Invalid routine page slug. Author id: ${page.id}`);
    const slug = slugProperty.rich_text.map((text) => text.plain_text).join();

    const avatarProperty = page.properties["avatar"];
    if (avatarProperty?.type !== "files")
      throw Error(`Invalid author avatar property. ${page.id}`);
    const avatarUrl = avatarProperty.files.map((select) => select.name)[0];
    if (!avatarUrl) throw Error(`Invalid author avatar. Author id: ${page.id}`);

    const lattesCurriculumProperty = page.properties["lattes_curriculum"];
    if (lattesCurriculumProperty?.type !== "url")
      throw Error(
        `Invalid author lattes_curriculum property. Author id: ${page.id}`
      );
    const lattesCurriculumUrl = lattesCurriculumProperty.url;
    if (!lattesCurriculumUrl)
      throw Error(
        `Invalid author lattes_curriculum property. Author id: ${page.id}`
      );

    return {
      id: page.id,
      name: name,
      slug: slug,
      avatarUrl,
      lattesCurriculumUrl,
    };
  }

  async getAuthor(authorId: string): Promise<Author> {
    const authorPage = await this.client.pages.retrieve({
      page_id: authorId,
    });
    const author = this.buildAuthor(authorPage);
    return author;
  }

  async getAuthors(): Promise<Author[]> {
    throw new Error("Method not implemented.");
  }
}
