import { Category } from "@monorepo/domain";
import { Client as NotionClient } from "@notionhq/client";
import { NotionCategoriesRepository } from "..";
import { categoryPageMock } from "./categoryPage.mock";

describe(NotionCategoriesRepository, () => {
  describe("getCategory", () => {
    const notionClient = {
      pages: {
        retrieve: async () => categoryPageMock,
      } as any,
    } as NotionClient;
    const categoriesRepository = new NotionCategoriesRepository(notionClient);
    it("should return a valid category", async () => {
      expect(await categoriesRepository.getCategory("any id")).toMatchObject({
        id: "d61dc1c3-cd1b-49c9-89a6-bea258b3d25e",
        name: "Cardiologia",
        slug: "cardiologia",
        colorTheme: "#BB342F",
      } as Category);
    });
  });
});
