import { Client as NotionClient } from "@notionhq/client";
import { NOTION_TOKEN } from "./../constants";
import { NotionAuthorsRepository } from "./authors";
import { NotionRoutineRepository } from "./routines";

export function createDataLayer() {
  const notionClient = new NotionClient({ auth: NOTION_TOKEN });
  const authorsRepository = new NotionAuthorsRepository(notionClient);
  const routinesRepository = new NotionRoutineRepository(
    notionClient,
    authorsRepository
  );
  return {
    authorsRepository,
    routinesRepository,
  };
}
