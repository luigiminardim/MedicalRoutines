import { NotionAuthorsRepository } from "./../NotionAuthorsRepository";
import authorsQueryMock from "./mocks/authorsQuery.json";
import authorPageMock from "./mocks/authorPage.json";
import { Client as NotionClient } from "@notionhq/client";
import { Author } from "@monorepo/domain";

describe(NotionAuthorsRepository, () => {
  const clientMock = {
    pages: {
      retrieve: async () => authorPageMock,
    } as any,
    databases: {
      query: async (databaseId: string) => authorsQueryMock,
    } as any,
  } as NotionClient;
  const authorsRepository = new NotionAuthorsRepository(clientMock);

  describe("getAuthor", () => {
    it("should correctly convert an author page into an Author", async () => {
      expect(await authorsRepository.getAuthor("any id")).toMatchObject({
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
        { name: "Ana Luiza M. dos Santos" } as Author,
        { name: "Carlos Henrique R. da Rocha" } as Author,
      ]);
    });
  });
});
