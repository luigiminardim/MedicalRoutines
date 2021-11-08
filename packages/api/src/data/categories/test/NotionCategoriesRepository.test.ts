import { Category } from "@monorepo/domain";
import { Client as NotionClient } from "@notionhq/client";
import { NotionCategoriesRepository } from "..";
import { categoriesQueryMock } from "./categoriesQuery.mock";
import { categoryPageMock } from "./categoryPage.mock";

describe(NotionCategoriesRepository, () => {
  const notionClient = {
    pages: {
      retrieve: async () => categoryPageMock,
    } as any,
    databases: {
      query: async (databaseId: string) => categoriesQueryMock,
    } as any,
  } as NotionClient;
  const categoriesRepository = new NotionCategoriesRepository(notionClient);

  describe("getCategory", () => {
    it("should return a valid category", async () => {
      expect(await categoriesRepository.getCategory("any id")).toMatchObject({
        id: "d61dc1c3-cd1b-49c9-89a6-bea258b3d25e",
        name: "Cardiologia",
        slug: "cardiologia",
        colorTheme: "#BB342F",
      } as Category);
    });
  });

  describe("getCategories", () => {
    it("should return all categories", async () => {
      expect(await categoriesRepository.getCategories()).toMatchObject([
        { id: "3cb1fb62-ff70-4ee8-bbaa-a58ccd45b757" },
        { id: "86af33fe-24e6-4ef8-90d5-83288d2b5015" },
        { id: "d61dc1c3-cd1b-49c9-89a6-bea258b3d25e" },
      ]);
    });
  });
});
