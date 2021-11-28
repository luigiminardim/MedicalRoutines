import { parse } from "./parse";
import axios from "axios";
import { Section } from "@monorepo/domain";
import { Client as NotionClient } from "@notionhq/client";
import { ListBlockChildrenResponse } from "@notionhq/client/build/src/api-endpoints";

export class NotionContentsRepository {
  constructor(private client: NotionClient) {}

  private async fetchImage(url: string): Promise<Buffer> {
    const { data: imageArrayBuffer } = await axios(url, {
      responseType: "arraybuffer",
    });
    return Buffer.from(imageArrayBuffer);
  }

  async getSections(pageId: string): Promise<Array<Section>> {
    const blockChildren: ListBlockChildrenResponse =
      await this.client.blocks.children.list({
        block_id: pageId,
      });
    const sections = await parse(blockChildren.results, (url: string) =>
      this.fetchImage(url)
    );
    return sections;
  }
}
