import { Client as NotionClient } from "@notionhq/client";
import {
  IGetRoutinesGateway,
  IGetRoutineGateway,
  GetRoutineDtoInput,
} from "@monorepo/domain";
import { Routine } from "@monorepo/domain/dist/modules/routines/entities/Routine";
import { GetPageResponse } from "@notionhq/client/build/src/api-endpoints";
import { NotionAuthorsRepository } from "../authors";
import { NotionCategoriesRepository } from "../categories";
import { NotionContentsRepository } from "../content";

export class NotionRoutineRepository
  implements IGetRoutineGateway, IGetRoutinesGateway
{
  constructor(
    private client: NotionClient,
    private authorsRespository: NotionAuthorsRepository,
    private categoriesRepository: NotionCategoriesRepository,
    private contentRepository: NotionContentsRepository
  ) {}

  private async buildRoutine(page: GetPageResponse): Promise<Routine> {
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
      throw Error(`Invalid routine tags property. Routine id: ${page.id}`);
    const tags = tagsProperty.multi_select.map((select) => select.name);

    const authorsProperty = page.properties["authors"];
    if (authorsProperty?.type !== "relation")
      throw Error(`Invalid routine authors property. Author id: ${page.id}`);
    const authors = await Promise.all(
      authorsProperty.relation
        .map((x) => x.id)
        .map((authorNotionId) =>
          this.authorsRespository.getAuthor(authorNotionId)
        )
    );

    const categoriesProperty = page.properties["categories"];
    if (categoriesProperty?.type !== "relation")
      throw Error(`Invalid rotine authors property. Routine id: ${page.id}`);
    const categories = await Promise.all(
      categoriesProperty.relation
        .map((x) => x.id)
        .map((categoryId) => this.categoriesRepository.getCategory(categoryId))
    );

    return {
      id: slug,
      name,
      categories: categories,
      tags,
      sections: await this.contentRepository.getSections(page.id),
      authors: authors,
    };
  }

  private routinesDatabaseId = "edfb99c1a7894667b332ab2e6d87fa1d";

  async getRoutine(input: GetRoutineDtoInput): Promise<Routine | null> {
    const queryReturn = await this.client.databases.query({
      database_id: this.routinesDatabaseId,
      filter: { property: "slug", text: { equals: input.id } },
    });
    const page = queryReturn.results[0];
    if (page) {
      return this.buildRoutine(page);
    } else {
      return null;
    }
  }

  async getRoutines(): Promise<Routine[]> {
    const routinesQuery = await this.client.databases.query({
      database_id: this.routinesDatabaseId,
      sorts: [{ property: "name", direction: "ascending" }],
    });
    const routines = Promise.all(
      routinesQuery.results.map((routinePage) => this.buildRoutine(routinePage))
    );
    return routines;
  }
}
