import { parse } from "./parse";
import axios from "axios";
import sizeOf from "image-size";
import { Section } from "@monorepo/domain";
import { Client as NotionClient } from "@notionhq/client";
import { ListBlockChildrenResponse } from "@notionhq/client/build/src/api-endpoints";

export class NotionContentsRepository {
  constructor(private client: NotionClient) {}

  private async fetchImage(url: string) {
    const { data: imageArrayBuffer, headers: imageResponseHeaders } =
      await axios(url, {
        responseType: "arraybuffer",
      });
    const base64 = Buffer.from(imageArrayBuffer).toString("base64");
    const { width, height } = sizeOf(imageArrayBuffer);
    return {
      base64,
      contentType: imageResponseHeaders["Content-Type"] ?? "",
      width: width ?? 0,
      height: height ?? 0,
    };
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
