import { Author, Category, Routine } from "@monorepo/domain";
import { Client as NotionClient } from "@notionhq/client";
import { NotionAuthorsRepository } from "../../authors";
import { NotionCategoriesRepository } from "../../categories";
import { NotionRoutineRepository } from "./../NotionRoutinesRepository";
import { pageResponseMock } from "./pageResponse.mock";

describe(NotionRoutineRepository, () => {
  describe("getRoutine", () => {
    const notionClientMock = {
      pages: {
        retrieve: () => pageResponseMock,
      } as any,
    } as NotionClient;

    const authorMock = { id: "authorMock" } as Author;
    const authorsRespositoryMock = {
      getAuthor: async (authorId: string) => authorMock,
    } as NotionAuthorsRepository;

    const categoryMock = { id: "categoryMock" } as Category;
    const categoryRepositoryMock = {
      getCategory: async (categoryId: string) => categoryMock,
    } as NotionCategoriesRepository;

    const routinesRepository = new NotionRoutineRepository(
      notionClientMock,
      authorsRespositoryMock,
      categoryRepositoryMock
    );
    it("should build a Routine using a PageResponse", async () => {
      expect(await routinesRepository.getRoutine("any id")).toMatchObject({
        id: "62ef44b1-5c06-4a7b-9812-e45960c9e4ce",
        name: "Rotina Teste",
        slug: "test-routine",
        tags: ["tag1", "tag2", "tag3", "tag4"],
        categories: [categoryMock, categoryMock, categoryMock],
        sections: [],
        authors: [authorMock, authorMock],
      } as Routine);
    });
  });
});
