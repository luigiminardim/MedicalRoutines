import { Category } from "@monorepo/domain";
import { Client as NotionClient } from "@notionhq/client";
import { NotionCategoriesRepository } from "..";
import categoryPageMock from "./mocks/categoryPage.json";
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
  const categoriesRepository = new NotionCategoriesRepository(notionClient);

  describe("getCategory", () => {
    it("should return a valid category", async () => {
      expect(await categoriesRepository.getCategory("any id")).toMatchObject({
        id: "cardiologia",
        name: "Cardiologia",
        colorTheme: "#BB342F",
      } as Category);
    });
  });

  describe("getCategories", () => {
    it("should return all categories", async () => {
      expect(await categoriesRepository.getCategories()).toMatchObject([
        { id: "endocrinologia" },
        { id: "emergencia" },
        { id: "cardiologia" },
      ]);
    });
  });
});
