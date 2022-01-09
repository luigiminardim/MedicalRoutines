import { parse } from "./parse";
import axios from "axios";
import type { Section, Routine, Organization } from "@monorepo/domain";
import { Client as NotionClient } from "@notionhq/client";
import { ListBlockChildrenResponse } from "@notionhq/client/build/src/api-endpoints";

export type UploadImageInput = {
  organizationSlug: Organization["slug"];
  routineSlug: Routine["slug"];
  imageName: string;
  imageBuffer: Buffer;
};

export type UploadImageOutput = {
  url: string;
};

export interface IImageRepository {
  uploadRoutineImage(input: UploadImageInput): Promise<UploadImageOutput>;
}

export class NotionContentsRepository {
  constructor(private client: NotionClient) {}

  private async fetchImage(url: string): Promise<Buffer> {
    const { data: imageArrayBuffer } = await axios(url, {
      responseType: "arraybuffer",
    });
    return Buffer.from(imageArrayBuffer);
  }

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
    uploadImage: (imageId: string, imageBuffer: Buffer) => Promise<string>
  ): Promise<Array<Section>> {
    const blockChildren: ListBlockChildrenResponse =
      await this.client.blocks.children.list({
        block_id: pageId,
      });
    const sections = await parse({
      blocks: blockChildren.results,
      fetchImage: (url: string) => this.fetchImage(url),
      saveImage: uploadImage,
      fetchTable: (tableId: string) => this.fetchTable(tableId),
      fetchChildren: (blockId: string) => this.fetchChildren(blockId),
    });
    return sections;
  }
}
