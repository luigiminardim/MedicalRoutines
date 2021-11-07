import { NotionAuthorsRepository } from "./../NotionAuthorsRepository";
import { authorPageMock } from "./authorPage.mock";
import { Client as NotionClient } from "@notionhq/client";

describe(NotionAuthorsRepository, () => {
  describe("getAuthor", () => {
    const clientMock = {
      pages: {
        retrieve: async () => authorPageMock,
      } as any,
    } as NotionClient;
    const authorsRepository = new NotionAuthorsRepository(clientMock);
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
});
