import { Client as NotionClient } from "@notionhq/client";
import { IRoutineRepository } from "@monorepo/domain";
import { Routine } from "@monorepo/domain/dist/modules/routines/entities/Routine";

export class NotionRoutineRepository implements IRoutineRepository {
  constructor(private client: NotionClient) {}

  async getRoutine(id: string): Promise<Routine | null> {
    const page = await this.client.pages.retrieve({
      page_id: "62ef44b15c064a7b9812e45960c9e4ce",
    });
    console.log(page);
    throw new Error("Method not implemented.");
  }

  getRoutines(): Promise<Routine[]> {
    throw new Error("Method not implemented.");
  }
}
