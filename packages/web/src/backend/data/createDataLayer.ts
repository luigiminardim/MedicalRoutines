import { NOTION_TOKEN } from "./../constants";
import { Client as NotionClient } from "@notionhq/client";
import { NotionRoutineRepository } from "./routines";

export function createDataLayer() {
  const notionClient = new NotionClient({ auth: NOTION_TOKEN });
  const routinesRepository = new NotionRoutineRepository(notionClient);
  return {
    routinesRepository,
  };
}
