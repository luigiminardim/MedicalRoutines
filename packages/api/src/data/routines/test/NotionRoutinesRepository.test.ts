import { Author, Routine } from "@monorepo/domain";
import { Client as NotionClient } from "@notionhq/client";
import { NotionAuthorsRepository } from "../../authors";
import { NotionRoutineRepository } from "./../NotionRoutinesRepository";
import { pageResponseMock } from "./pageResponse.mock";

describe(NotionRoutineRepository, () => {
  describe("getRoutine", () => {
    const mockAuthor: Author = {
      id: "mockAuthor",
    } as Author;
    const notionClientMock = {
      pages: {
        retrieve: () => pageResponseMock,
      } as any,
    } as NotionClient;
    const authorsRespositoryMock = {
      getAuthor: async (authorId: string) => mockAuthor,
    } as NotionAuthorsRepository;
    const routinesRepository = new NotionRoutineRepository(
      notionClientMock,
      authorsRespositoryMock
    );
    it("should build a Routine using a PageResponse", async () => {
      expect(await routinesRepository.getRoutine("any id")).toMatchObject({
        id: "62ef44b1-5c06-4a7b-9812-e45960c9e4ce",
        name: "Rotina Teste",
        slug: "test-routine",
        tags: ["tag1", "tag2", "tag3", "tag4"],
        categories: [],
        sections: [],
        authors: [mockAuthor, mockAuthor],
      } as Routine);
    });
  });
});
