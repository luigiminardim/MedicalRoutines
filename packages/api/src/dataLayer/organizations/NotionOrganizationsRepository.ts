import { Client as NotionClient } from "@notionhq/client";
import {
  Organization,
  IGetOrganizationGateway,
  GetOrganizationInput,
} from "@monorepo/domain";
import { GetPageResponse } from "@notionhq/client/build/src/api-endpoints";

const ORGANIZATION_DATABASE_ID = "b1330a188f6d499eb4baec789e00502b";

export class NotionOrganizationsRepository implements IGetOrganizationGateway {
  constructor(private client: NotionClient) {}

  async getOrganization({
    organizationSlug,
  }: GetOrganizationInput): Promise<Organization> {
    const organizationsQuery = await this.client.databases.query({
      database_id: ORGANIZATION_DATABASE_ID,
      filter: { property: "slug", rich_text: { equals: organizationSlug } },
    });
    const organizationPage = organizationsQuery.results[0]!;
    const organization = this.buildOrganization(organizationPage);
    return organization;
  }

  async getOrganizationById(organizationId: string): Promise<Organization> {
    const organizationPage = await this.client.pages.retrieve({
      page_id: organizationId,
    });
    const organization = this.buildOrganization(organizationPage);
    return organization;
  }

  async getOrganizationId(
    organizationSlug: Organization["slug"]
  ): Promise<string> {
    const organizationsQuery = await this.client.databases.query({
      database_id: ORGANIZATION_DATABASE_ID,
      filter: { property: "slug", rich_text: { equals: organizationSlug } },
    });
    const organizationId = organizationsQuery.results[0]!.id;
    return organizationId;
  }

  private buildOrganization(page: GetPageResponse): Organization {
    const slug = this.extractSlug(page);
    const name = this.extractName(page);
    return {
      slug,
      name,
    };
  }

  private extractSlug(page: GetPageResponse): Organization["slug"] {
    const slugProperty = page.properties["slug"];
    if (slugProperty?.type !== "rich_text")
      throw Error(`Invalid organization slug. Organization id: ${page.id}`);
    const slug = slugProperty.rich_text.map((text) => text.plain_text).join();
    return slug;
  }

  private extractName(page: GetPageResponse): Organization["name"] {
    const nameProperty = page.properties["name"];
    if (nameProperty?.type !== "title")
      throw Error(`Invalid routine page title. Routine id: ${page.id}`);
    const name = nameProperty.title.map((text) => text.plain_text).join();
    return name;
  }
}
