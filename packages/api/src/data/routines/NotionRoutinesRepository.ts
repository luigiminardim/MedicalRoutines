import { Client as NotionClient } from "@notionhq/client";
import { IRoutineRepository } from "@monorepo/domain";
import { Routine } from "@monorepo/domain/dist/modules/routines/entities/Routine";
import { GetPageResponse } from "@notionhq/client/build/src/api-endpoints";
import { NotionAuthorsRepository } from "../authors";

export class NotionRoutineRepository implements IRoutineRepository {
  constructor(
    private client: NotionClient,
    private authorsRespository: NotionAuthorsRepository
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
        .map((authorId) => this.authorsRespository.getAuthor(authorId))
    );

    return {
      id: page.id,
      slug: slug,
      name,
      categories: [],
      tags,
      sections: [],
      authors: authors,
    };
  }

  async getRoutine(routineId: string): Promise<Routine | null> {
    const page = await this.client.pages.retrieve({
      page_id: routineId,
    });
    return this.buildRoutine(page);
  }

  getRoutines(): Promise<Routine[]> {
    throw new Error("Method not implemented.");
  }
}
