import {
  RichText,
  TextSpan,
  Section,
  ContentBlock,
  Figure,
} from "@monorepo/domain";
import { Client as NotionClient } from "@notionhq/client";
import { ListBlockChildrenResponse } from "@notionhq/client/build/src/api-endpoints";
import axios from "axios";
import sizeOf from "image-size";

const richTextConverter = (notionRichText: Array<any>): RichText => {
  return {
    type: "RichText",
    spans: notionRichText.map((text): TextSpan => {
      if (text.type === "text") {
        return {
          type: "TextSpan",
          string: text.text.content,
          decorations: {
            bold: text.annotations.bold,
            color:
              text.annotations.color === "default"
                ? null
                : text.annotations.color,
            italic: text.annotations.italic,
            subscript: false,
            underline: text.annotations.underline,
          },
        };
      } else if (text.type === "equation") {
        const subscriptRegex = /^_\{(.*)\}$/gm; // _{subscript}
        const subscriptRegexResult = subscriptRegex.exec(
          text.equation.expression
        );
        if (subscriptRegexResult?.[1]) {
          return {
            type: "TextSpan",
            string: subscriptRegexResult[1],
            decorations: {
              subscript: true,
              color: text.annotations.color,
              underline: false,
              bold: false,
              italic: false,
            },
          };
        } else {
          throw Error(
            `richTextConverter doesn't implement equation conversion for: ${text.equation.expression}`
          );
        }
      } else {
        throw Error(
          `richTextConverter doesn't implement conversion for type ${text.type}`
        );
      }
    }),
  };
};

type ContentParserContext = {
  blocks: any;
  sectionLevel: number;
};

type ContentParser<T> = (context: ContentParserContext) => Promise<null | {
  content: T;
  context: ContentParserContext;
}>;

const arrayParserCombiner: <T>(
  parser: ContentParser<T>
) => ContentParser<Array<T>> = (parser) => async (context) => {
  const parseResult = await parser(context);
  if (!parseResult) {
    return { content: [], context };
  } else {
    const { content: content0, context: context0 } = parseResult;
    const restParseResult = await arrayParserCombiner(parser)(context0);
    if (!restParseResult) {
      return null;
    } else {
      const { content: contents1, context: context1 } = restParseResult;
      return {
        content: [content0, ...contents1],
        context: context1,
      };
    }
  }
};

const sectionParser: ContentParser<Section> = async (context) => {
  const { blocks, sectionLevel } = context;
  const [block0, ...blocks0] = blocks;
  const blockInfo =
    block0?.type === "heading_1"
      ? {
          headingLevel: 1,
          text: block0.heading_1.text,
          plainText: block0.heading_1.text
            .map((x: any) => x.plain_text)
            .join(""),
        }
      : block0?.type === "heading_2"
      ? {
          headingLevel: 2,
          text: block0.heading_2.text,
          plainText: block0.heading_2.text
            .map((x: any) => x.plain_text)
            .join(""),
        }
      : block0?.type === "heading_3"
      ? {
          headingLevel: 3,
          text: block0.heading_3.text,
          plainText: block0.heading_3.text
            .map((x: any) => x.plain_text)
            .join(""),
        }
      : null;
  if (blockInfo === null || blockInfo.headingLevel <= sectionLevel) {
    return null;
  } else {
    const childrenParseResult = await arrayParserCombiner(contentParser)({
      ...context,
      blocks: blocks0,
      sectionLevel: blockInfo.headingLevel,
    });
    return {
      content: {
        type: "Section",
        title: richTextConverter(blockInfo.text),
        plainTitle: blockInfo.plainText,
        children: childrenParseResult?.content ?? [],
      },
      context: {
        sectionLevel: context.sectionLevel,
        blocks: childrenParseResult?.context.blocks ?? blocks0,
      },
    };
  }
};

const paragraphParser: ContentParser<RichText> = async (context) => {
  const { blocks } = context;
  const [block0, ...blocks0] = blocks;
  if (block0?.type !== "paragraph") {
    return null;
  } else {
    return {
      content: richTextConverter(block0.paragraph.text),
      context: {
        ...context,
        blocks: blocks0,
      },
    };
  }
};

const figureParser: ContentParser<Figure> = async (context) => {
  const { blocks } = context;
  const [block0, ...blocks0] = blocks;
  if (block0?.type !== "image") {
    return null;
  } else {
    const imageUrl =
      block0.image.type === "file"
        ? block0.image.file.url
        : block0.image.external.url;
    const { data: imageArrayBuffer, headers: imageResponseHeaders } =
      await axios(imageUrl, {
        responseType: "arraybuffer",
      });
    const { width, height } = sizeOf(imageArrayBuffer);
    return {
      context: { ...context, blocks: blocks0 },
      content: {
        type: "Figure",
        image: {
          base64: Buffer.from(imageArrayBuffer).toString("base64"),
          contentType: imageResponseHeaders["Content-Type"] ?? "",
          width,
          height,
        },
        caption: block0.image.caption
          ? richTextConverter(block0.image.caption)
          : undefined,
      },
    };
  }
};

const contentParser: ContentParser<ContentBlock> = async (context) => {
  return (
    (await sectionParser(context)) ||
    (await paragraphParser(context)) ||
    (await figureParser(context))
  );
};

export class NotionContentsRepository {
  constructor(private client: NotionClient) {}

  private async buildSections(
    blocks: ListBlockChildrenResponse["results"]
  ): Promise<Array<Section>> {
    const parserResult = await arrayParserCombiner(sectionParser)({
      blocks,
      sectionLevel: 0,
    });
    if (parserResult) {
      return parserResult.content;
    } else {
      return [];
    }
  }

  async getSections(pageId: string): Promise<Array<Section>> {
    const blockChildren = await this.client.blocks.children.list({
      block_id: pageId,
    });
    const sections = await this.buildSections(blockChildren.results);
    return sections;
  }
}