import { Organization } from "@monorepo/domain";
import { Client as NotionClient } from "@notionhq/client";
import { NotionOrganizationsRepository } from "./../NotionOrganizationsRepository";
import queryOrganizationMock from "./mocks/queryOrganization.json";

describe(NotionOrganizationsRepository, () => {
  describe("getOrganization", () => {
    const notionClientMock = {
      databases: {
        query: async () => queryOrganizationMock,
      } as any,
    } as NotionClient;
    const organizationRepository = new NotionOrganizationsRepository(
      notionClientMock
    );
    it("should build an organization from notion", async () => {
      const organization = await organizationRepository.getOrganization({
        organizationSlug: "any slug",
      });
      const expectedOrganization: Organization = {
        slug: "test-organization",
        name: "Test Organization",
      };
      expect(organization).toMatchObject(expectedOrganization);
    });
  });
});
