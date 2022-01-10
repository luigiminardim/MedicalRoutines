import { NotionOrganizationsRepository } from "./organizations";
import { AwsS3ImageRepository } from "./content/AwsS3ImageRepository";
import { Client as NotionClient } from "@notionhq/client";
import { NOTION_TOKEN } from "../constants";
import { NotionAuthorsRepository } from "./authors";
import { NotionRoutineRepository } from "./routines";
import { NotionCategoriesRepository } from "./categories";
import { NotionContentsRepository } from "./content";

export function createDataLayer() {
  const notionClient = new NotionClient({ auth: NOTION_TOKEN });
  const organizationRepository = new NotionOrganizationsRepository(
    notionClient
  );
  const authorsRepository = new NotionAuthorsRepository(
    notionClient,
    organizationRepository
  );
  const categoriesRepository = new NotionCategoriesRepository(
    notionClient,
    organizationRepository
  );
  const imageRepository = new AwsS3ImageRepository();
  const contentRepository = new NotionContentsRepository(notionClient);
  const routinesRepository = new NotionRoutineRepository(
    notionClient,
    organizationRepository,
    authorsRepository,
    categoriesRepository,
    contentRepository,
    imageRepository
  );
  return {
    organizationRepository,
    authorsRepository,
    routinesRepository,
    categoriesRepository,
  };
}
