import { Client as NotionClient } from "@notionhq/client";
import { Organization } from "@monorepo/domain";
import { GetPageResponse } from "@notionhq/client/build/src/api-endpoints";

const ORGANIZATION_DATABASE_ID = "b1330a188f6d499eb4baec789e00502b";

export class NotionOrganizationsRepository {
  constructor(private client: NotionClient) {}

  private buildOrganization(page: GetPageResponse): Organization {
    const slugProperty = page.properties["slug"];
    if (slugProperty?.type !== "rich_text")
      throw Error(`Invalid organization slug. Organization id: ${page.id}`);
    const slug = slugProperty.rich_text.map((text) => text.plain_text).join();

    return {
      slug,
    };
  }

  async getOrganization(slug: Organization["slug"]): Promise<Organization> {
    const organizationsQuery = await this.client.databases.query({
      database_id: ORGANIZATION_DATABASE_ID,
      filter: { property: "slug", rich_text: { equals: slug } },
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
}
