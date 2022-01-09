import { NotionOrganizationsRepository } from "../organizations";
import { Client as NotionClient } from "@notionhq/client";
import {
  Author,
  IGetAuthorsGateway,
  GetAuthorsDtoInput,
} from "@monorepo/domain";
import { GetPageResponse } from "@notionhq/client/build/src/api-endpoints";

export class NotionAuthorsRepository implements IGetAuthorsGateway {
  constructor(
    private client: NotionClient,
    private organizationsRepository: NotionOrganizationsRepository
  ) {}

  private buildAuthor(page: GetPageResponse): Author {
    const nameProperty = page.properties["name"];
    if (nameProperty?.type !== "title")
      throw Error(`Invalid author page title. Author id: ${page.id}`);
    const name = nameProperty.title.map((text) => text.plain_text).join();

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
      avatarUrl,
      lattesCurriculumUrl,
    };
  }

  async getAuthorById(id: Author["id"]): Promise<Author> {
    const authorPage = await this.client.pages.retrieve({
      page_id: id,
    });
    const author = this.buildAuthor(authorPage);
    return author;
  }

  async getAuthors(input: GetAuthorsDtoInput): Promise<Author[]> {
    const authorsDatabaseId = "59a40af1c99246fda5842e1e768ee131";
    const organizationId = await this.organizationsRepository.getOrganizationId(
      input.organizationSlug
    );
    const authorsQuery = await this.client.databases.query({
      database_id: authorsDatabaseId,
      filter: {
        property: "organization",
        relation: { contains: organizationId },
      },
    });
    const authors = authorsQuery.results.map((authorsPage) =>
      this.buildAuthor(authorsPage)
    );
    return authors;
  }
}
