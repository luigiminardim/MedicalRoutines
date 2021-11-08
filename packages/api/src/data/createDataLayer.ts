import { Client as NotionClient } from "@notionhq/client";
import { NOTION_TOKEN } from "./../constants";
import { NotionAuthorsRepository } from "./authors";
import { NotionRoutineRepository } from "./routines";
import { NotionCategoriesRepository } from "./categories";

export function createDataLayer() {
  const notionClient = new NotionClient({ auth: NOTION_TOKEN });
  const authorsRepository = new NotionAuthorsRepository(notionClient);
  const categoriesRepository = new NotionCategoriesRepository(notionClient);
  const routinesRepository = new NotionRoutineRepository(
    notionClient,
    authorsRepository,
    categoriesRepository
  );
  return {
    authorsRepository,
    routinesRepository,
    categoriesRepository,
  };
}
