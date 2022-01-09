import { NotionOrganizationsRepository } from "./../../organizations/NotionOrganizationsRepository";
import { NotionAuthorsRepository } from "../NotionAuthorsRepository";
import authorsQueryMock from "./mocks/authorsQuery.json";
import authorPageMock from "./mocks/authorPage.json"; // https://api.notion.com/v1/pages/a0500b34-bcd2-48d8-a6e9-d0524940bd66
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
  const organizationsRepositoryMock = {
    getOrganizationId: async (slug: string) => "any id",
  } as NotionOrganizationsRepository;
  const authorsRepository = new NotionAuthorsRepository(
    clientMock,
    organizationsRepositoryMock
  );

  describe("getAuthor", () => {
    it("should correctly convert an author page into an Author", async () => {
      expect(
        await authorsRepository.getAuthorById("any page id")
      ).toMatchObject({
        name: "Eduardo Lemos Rocha",
        avatarUrl:
          "http://ft.unb.br/index.php?option=com_pessoas&view=pessoas&layout=perfil&id=99",
        lattesCurriculumUrl: "http://lattes.cnpq.br/1989010115232505",
      });
    });
  });

  describe("getAuthors", () => {
    it("should convert the authors database into Author array", async () => {
      expect(
        await authorsRepository.getAuthors({ organizationSlug: "any slug" })
      ).toMatchObject([
        { name: "Eduardo Lemos Rocha" } as Author,
        { name: "Luigi Minardi Ferreira Maia" } as Author,
      ]);
    });
  });
});
