import { Client as NotionClient } from "@notionhq/client";
import { NOTION_TOKEN } from "../constants";
import { NotionAuthorsRepository } from "./authors";
import { NotionRoutineRepository } from "./routines";
import { NotionCategoriesRepository } from "./categories";
import { NotionContentsRepository } from "./content";

export function createDataLayer() {
  const notionClient = new NotionClient({ auth: NOTION_TOKEN });
  const authorsRepository = new NotionAuthorsRepository(notionClient);
  const categoriesRepository = new NotionCategoriesRepository(notionClient);
  const contentRepository = new NotionContentsRepository(notionClient);
  const routinesRepository = new NotionRoutineRepository(
    notionClient,
    authorsRepository,
    categoriesRepository,
    contentRepository
  );
  return {
    authorsRepository,
    routinesRepository,
    categoriesRepository,
  };
}
