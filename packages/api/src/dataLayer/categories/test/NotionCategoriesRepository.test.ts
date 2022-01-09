import { NotionOrganizationsRepository } from "./../../organizations/NotionOrganizationsRepository";
import { Category } from "@monorepo/domain";
import { Client as NotionClient } from "@notionhq/client";
import { NotionCategoriesRepository } from "..";
import categoryPageMock from "./mocks/categoryPage.json"; // api.notion.com/v1/pages/d61dc1c3cd1b49c989a6bea258b3d25e
import categoriesQueryMock from "./mocks/categoriesQuery.json";

describe(NotionCategoriesRepository, () => {
  const notionClient = {
    pages: {
      retrieve: async () => categoryPageMock,
    } as any,
    databases: {
      query: async (databaseId: string) => categoriesQueryMock,
    } as any,
  } as NotionClient;
  const organizationsRepositoryMock = {
    getOrganizationId: async (slug: string) => "any id",
  } as NotionOrganizationsRepository;
  const categoriesRepository = new NotionCategoriesRepository(
    notionClient,
    organizationsRepositoryMock
  );

  describe("getCategory", () => {
    it("should return a valid category", async () => {
      expect(
        await categoriesRepository.getCategoryById("any id")
      ).toMatchObject({
        slug: "cardiologia",
        name: "Cardiologia",
        colorTheme: "#BB342F",
      } as Category);
    });
  });

  describe("getCategories", () => {
    it("should return all categories", async () => {
      expect(
        await categoriesRepository.getCategories({
          organizationSlug: "any slug",
        })
      ).toMatchObject([
        { slug: "endocrinologia" },
        { slug: "emergencia" },
        { slug: "cardiologia" },
      ]);
    });
  });
});
