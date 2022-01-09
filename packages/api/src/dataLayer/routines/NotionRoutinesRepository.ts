import { GetPageResponse } from "@notionhq/client/build/src/api-endpoints";
import { AwsS3ImageRepository } from "./../content/AwsS3ImageRepository";
import { Client as NotionClient } from "@notionhq/client";
import {
  IGetRoutinesGateway,
  IGetRoutineGateway,
  GetRoutineDtoInput,
  GetRoutinesGatewayInput,
  IGetRoutineContentGateway,
  GetRoutineContentInput,
  Section,
  Organization,
} from "@monorepo/domain";
import { Routine } from "@monorepo/domain/dist/modules/routines/entities/Routine";
import { NotionAuthorsRepository } from "../authors";
import { NotionCategoriesRepository } from "../categories";
import { NotionContentsRepository } from "../content";
import { NotionOrganizationsRepository } from "../organizations";

export class NotionRoutineRepository
  implements IGetRoutineGateway, IGetRoutinesGateway, IGetRoutineContentGateway
{
  private routinesDatabaseId = "edfb99c1a7894667b332ab2e6d87fa1d";

  constructor(
    private client: NotionClient,
    private organizationsRepository: NotionOrganizationsRepository,
    private authorsRespository: NotionAuthorsRepository,
    private categoriesRepository: NotionCategoriesRepository,
    private contentRepository: NotionContentsRepository,
    private imageRespository: AwsS3ImageRepository
  ) {}

  async getRoutine(input: GetRoutineDtoInput): Promise<Routine | null> {
    const queryReturn = await this.client.databases.query({
      database_id: this.routinesDatabaseId,
      filter: { property: "slug", text: { equals: input.routineSlug } },
    });
    const page = queryReturn.results[0];
    if (page) {
      return this.buildRoutine(page);
    } else {
      return null;
    }
  }

  async getRoutines(input: GetRoutinesGatewayInput): Promise<Routine[]> {
    const organizationId = await this.organizationsRepository.getOrganizationId(
      input.organizationSlug
    );
    const routinesQuery = await this.client.databases.query({
      database_id: this.routinesDatabaseId,
      filter: {
        property: "organization",
        relation: { contains: organizationId },
      },
      sorts: [{ property: "name", direction: "ascending" }],
    });
    const routines = await Promise.all(
      routinesQuery.results.map((routinePage) => this.buildRoutine(routinePage))
    );
    return routines;
  }

  async getRoutineContent({
    routineSlug,
  }: GetRoutineContentInput): Promise<Array<Section>> {
    const queryReturn = await this.client.databases.query({
      database_id: this.routinesDatabaseId,
      filter: { property: "slug", text: { equals: routineSlug } },
    });
    const page = queryReturn.results[0]!;
    const routineId = page.id;
    const organization = await this.extractOrganization(page);
    const sections = await this.contentRepository.getSections(
      routineId,
      async (imageName, imageBuffer) => {
        const { url } = await this.imageRespository.uploadRoutineImage({
          imageBuffer,
          imageName,
          organizationSlug: organization.slug,
          routineSlug: routineSlug,
        });
        return url;
      }
    );
    return sections;
  }

  private async buildRoutine(page: GetPageResponse): Promise<Routine> {
    const name = this.extractName(page);
    const slug = this.extractSlug(page);
    const tags = this.extractTags(page);
    const categories = await this.extractCategories(page);
    const authors = await this.extractAuthors(page);
    return {
      slug,
      name,
      categories,
      tags,
      authors,
    };
  }

  private extractName(page: GetPageResponse): Routine["name"] {
    const nameProperty = page.properties["name"];
    if (nameProperty?.type !== "title")
      throw Error(`Invalid routine page title. Routine id: ${page.id}`);
    const name = nameProperty.title.map((text) => text.plain_text).join();
    return name;
  }

  private extractSlug(page: GetPageResponse): Routine["slug"] {
    const slugProperty = page.properties["slug"];
    if (slugProperty?.type !== "rich_text")
      throw Error(`Invalid routine page slug. Routine id: ${page.id}`);
    const slug = slugProperty.rich_text.map((text) => text.plain_text).join();
    return slug;
  }

  private extractTags(page: GetPageResponse): Routine["tags"] {
    const tagsProperty = page.properties["tags"];
    if (tagsProperty?.type !== "multi_select")
      throw Error(`Invalid routine tags property. Routine id: ${page.id}`);
    const tags = tagsProperty.multi_select.map((select) => select.name);
    return tags;
  }

  private async extractCategories(
    page: GetPageResponse
  ): Promise<Routine["categories"]> {
    const categoriesProperty = page.properties["categories"];
    if (categoriesProperty?.type !== "relation")
      throw Error(`Invalid rotine authors property. Routine id: ${page.id}`);
    const categories = await Promise.all(
      categoriesProperty.relation
        .map((x) => x.id)
        .map((categoryId) =>
          this.categoriesRepository.getCategoryById(categoryId)
        )
    );
    return categories;
  }

  private async extractAuthors(
    page: GetPageResponse
  ): Promise<Routine["authors"]> {
    const authorsProperty = page.properties["authors"];
    if (authorsProperty?.type !== "relation")
      throw Error(`Invalid routine authors property. Author id: ${page.id}`);
    const authors = await Promise.all(
      authorsProperty.relation
        .map((x) => x.id)
        .map((authorNotionId) =>
          this.authorsRespository.getAuthorById(authorNotionId)
        )
    );
    return authors;
  }

  private async extractOrganization(
    page: GetPageResponse
  ): Promise<Organization> {
    const organizationProperty = page?.properties["organization"];
    if (organizationProperty?.type !== "relation")
      throw Error(`Invalid routine organization. Routine id: ${page?.id}`);
    const organizationId = organizationProperty.relation[0]!.id;
    const organization = await this.organizationsRepository.getOrganizationById(
      organizationId
    );
    return organization;
  }
}
