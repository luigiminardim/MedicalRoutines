import { parse } from "./parse";
import type { ImageRecord, Section } from "@monorepo/domain";
import { Client as NotionClient } from "@notionhq/client";
import { ListBlockChildrenResponse } from "@notionhq/client/build/src/api-endpoints";

export class NotionContentsRepository {
  constructor(private client: NotionClient) {}

  private async fetchTable(tableId: string) {
    const database = await this.client.databases.retrieve({
      database_id: tableId,
    });
    const query = await this.client.databases.query({
      database_id: tableId,
      sorts: [{ property: "#", direction: "ascending" }],
    });
    return { database, query };
  }

  private async fetchChildren(blockId: string) {
    return (await this.client.blocks.children.list({ block_id: blockId }))
      .results;
  }

  async getSections(
    pageId: string,
    uploadImage: (imageId: string, imageUrl: string) => Promise<ImageRecord>
  ): Promise<Array<Section>> {
    const blockChildren: ListBlockChildrenResponse =
      await this.client.blocks.children.list({
        block_id: pageId,
      });
    const sections = await parse({
      blocks: blockChildren.results,
      saveImage: uploadImage,
      fetchTable: (tableId: string) => this.fetchTable(tableId),
      fetchChildren: (blockId: string) => this.fetchChildren(blockId),
    });
    return sections;
  }
}
