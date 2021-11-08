import { NotionAuthorsRepository } from "./../NotionAuthorsRepository";
import { authorPageMock } from "./authorPage.mock";
import { Client as NotionClient } from "@notionhq/client";
import { queryAuthorsMock } from "./queryAuthors.mock";
import { Author } from "@monorepo/domain";

describe(NotionAuthorsRepository, () => {
  const clientMock = {
    pages: {
      retrieve: async () => authorPageMock,
    } as any,
    databases: {
      query: async (databaseId: string) => queryAuthorsMock,
    } as any,
  } as NotionClient;
  const authorsRepository = new NotionAuthorsRepository(clientMock);

  describe("getAuthor", () => {
    it("should correctly convert an author page into an Author", async () => {
      expect(await authorsRepository.getAuthor("any id")).toMatchObject({
        id: "a0500b34-bcd2-48d8-a6e9-d0524940bd66",
        slug: "ana-luiza",
        name: "Ana Luiza M. dos Santos",
        avatarUrl:
          "http://ft.unb.br/index.php?option=com_pessoas&view=pessoas&layout=perfil&id=99",
        lattesCurriculumUrl: "http://lattes.cnpq.br/1989010115232505",
      });
    });
  });

  describe("getAuthors", () => {
    it("should convert the authors database into Author array", async () => {
      expect(await authorsRepository.getAuthors()).toMatchObject([
        { id: "a0500b34-bcd2-48d8-a6e9-d0524940bd66" } as Author,
        { id: "e766699f-b51f-40c4-8b82-f6b7124a4a56" } as Author,
      ]);
    });
  });
});
