import { UploadImageInput } from "../../content";
import { AwsS3ImageRepository } from "./../../content/AwsS3ImageRepository";
import { NotionContentsRepository } from "./../../content/NotionContentsRepository";
import { Author, Category, Organization, Routine } from "@monorepo/domain";
import { Client as NotionClient } from "@notionhq/client";
import { NotionAuthorsRepository } from "../../authors";
import { NotionCategoriesRepository } from "../../categories";
import { NotionRoutineRepository } from "../NotionRoutinesRepository";
import queryRoutinesMock from "./mocks/queryRoutines.json";
import { NotionOrganizationsRepository } from "../../organizations";

describe(NotionRoutineRepository, () => {
  const notionClientMock = {
    databases: {
      query: async () => queryRoutinesMock,
    } as any,
  } as NotionClient;

  const authorMock = { name: "Author Mock" } as Author;

  const organizationsRepositoryMock = {
    getOrganizationById: async (id: string) =>
      ({ slug: "test-organization" } as Organization),
    getOrganizationId: async (slug: string) => "any id",
  } as NotionOrganizationsRepository;

  const authorsRespositoryMock = {
    getAuthorById: async (authorNotionId: string) => authorMock,
  } as NotionAuthorsRepository;

  const categoryMock = { slug: "categoryMock" } as Category;

  const categoryRepositoryMock = {
    getCategoryById: async (categoryId: string) => categoryMock,
  } as NotionCategoriesRepository;

  const contentRepositoryMock = {
    getSections: async (pageId, context) => [] as Array<unknown>,
  } as NotionContentsRepository;

  const imageRepositoryMock = {
    uploadRoutineImage: async (input: UploadImageInput) => {
      return { url: "any url" };
    },
  } as AwsS3ImageRepository;

  const routinesRepository = new NotionRoutineRepository(
    notionClientMock,
    organizationsRepositoryMock,
    authorsRespositoryMock,
    categoryRepositoryMock,
    contentRepositoryMock,
    imageRepositoryMock
  );

  describe("getRoutine", () => {
    it("should build a Routine using a PageResponse", async () => {
      expect(
        await routinesRepository.getRoutine({ routineSlug: "any slug" })
      ).toMatchObject({
        slug: "test-routine",
        name: "Rotina Teste",
        tags: ["tag1", "tag2", "tag3", "tag4"],
        categories: [categoryMock, categoryMock, categoryMock],
        authors: [authorMock, authorMock],
      } as Routine);
    });
  });

  describe("getRoutines", () => {
    it("should return all routines", async () => {
      expect(
        await routinesRepository.getRoutines({ organizationSlug: "any slug" })
      ).toMatchObject([{ slug: "test-routine" }]);
    });
  });
});
