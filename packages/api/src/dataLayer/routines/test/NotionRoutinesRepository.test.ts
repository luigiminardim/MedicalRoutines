import { Author, Category, Routine } from "@monorepo/domain";
import { Client as NotionClient } from "@notionhq/client";
import { NotionAuthorsRepository } from "../../authors";
import { NotionCategoriesRepository } from "../../categories";
import { NotionRoutineRepository } from "../NotionRoutinesRepository";
import queryRoutinesMock from "./mocks/queryRoutines.json";

describe(NotionRoutineRepository, () => {
  const notionClientMock = {
    databases: {
      query: async () => queryRoutinesMock,
    } as any,
  } as NotionClient;

  const authorMock = { name: "Author Mock" } as Author;

  const authorsRespositoryMock = {
    getAuthor: async (authorNotionId: string) => authorMock,
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

  describe("getRoutine", () => {
    it("should build a Routine using a PageResponse", async () => {
      expect(
        await routinesRepository.getRoutine({ id: "any id" })
      ).toMatchObject({
        id: "test-routine",
        name: "Rotina Teste",
        tags: ["tag1", "tag2", "tag3", "tag4"],
        categories: [categoryMock, categoryMock, categoryMock],
        sections: [],
        authors: [authorMock, authorMock],
      } as Routine);
    });
  });

  describe("getRoutines", () => {
    it("should return all routines", async () => {
      expect(await routinesRepository.getRoutines()).toMatchObject([
        { id: "test-routine" },
      ]);
    });
  });
});
