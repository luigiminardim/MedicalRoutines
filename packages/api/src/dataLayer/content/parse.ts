import {
  GetDatabaseResponse,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import sizeOf from "image-size";
import {
  RichText,
  TextSpan,
  Section,
  ContentBlock,
  Figure,
  Table,
  ListItem,
  List,
} from "@monorepo/domain";

export type ContentParserContext = {
  blocks: any;
  sectionLevel: number;
  fetchImage: (url: string) => Promise<Buffer>;
  saveImage: (imageId: string, imageBuffer: Buffer) => Promise<string>;
  fetchTable: (
    tableId: string
  ) => Promise<{ database: GetDatabaseResponse; query: QueryDatabaseResponse }>;
  fetchChildren: (blockId: string) => Promise<any>;
};

type ContentParser<T> = (context: ContentParserContext) => Promise<null | {
  content: T;
  context: ContentParserContext;
}>;

function richTextFromString(string: string): RichText {
  return {
    type: "RichText",
    spans: [
      {
        type: "TextSpan",
        string,
        link: null,
        decorations: {
          bold: false,
          color: null,
          italic: false,
          subscript: false,
          underline: false,
        },
      },
    ],
  };
}

const richTextConverter = (notionRichText: Array<any>): RichText => {
  return {
    type: "RichText",
    spans: notionRichText.map((text): TextSpan => {
      if (text.type === "text") {
        return {
          type: "TextSpan",
          string: text.text.content,
          link: text.text.link?.url
            ? { type: "url", url: text.text.link.url }
            : null,
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
            link: null,
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

const arrayParserCombiner: <T>(
  parser: ContentParser<T>
) => ContentParser<Array<T>> = (parser) => async (context) => {
  const { blocks } = context;
  if (blocks.length === 0) {
    return {
      context,
      content: [],
    };
  } else {
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
        ...context,
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
  const { blocks, saveImage } = context;
  const [block0, ...blocks0] = blocks;
  if (block0?.type !== "image") {
    return null;
  } else {
    const notionImageUrl =
      block0.image.type === "file"
        ? block0.image.file.url
        : block0.image.external.url;
    const imageBuffer = await context.fetchImage(notionImageUrl);
    const { height, width, type } = sizeOf(imageBuffer);
    const savedImageUrl = await saveImage(block0.id, imageBuffer);
    return {
      context: { ...context, blocks: blocks0 },
      content: {
        type: "Figure",
        image: {
          url: savedImageUrl,
          format: type ?? "",
          width: width ?? 0,
          height: height ?? 0,
        },
        caption: block0.image.caption
          ? richTextConverter(block0.image.caption)
          : undefined,
      },
    };
  }
};

const tableParser: ContentParser<Table> = async (context) => {
  const { blocks } = context;
  const [block0, ...blocks0] = blocks;
  if (block0?.type !== "child_database") {
    return null;
  } else {
    const getHeader = (property: any) => {
      const headerRegex = /^(\d)*\. (.*)$/gm; // 1. Header => [, "1", "Header"]
      const [, positonStr = "0", header = ""] =
        headerRegex.exec(property) ?? [];
      const position = Number.parseFloat(positonStr);
      return { position, header };
    };

    const { database, query } = (await context.fetchTable(block0.id)) as any;
    const dataProperties = Object.keys(database.properties)
      .filter((p) => p !== "#")
      .sort((a, b) => {
        const { position: a_p } = getHeader(a);
        const { position: b_p } = getHeader(b);
        return a_p < b_p ? -1 : a_p === b_p ? 0 : 1;
      });
    return {
      context: {
        ...context,
        blocks: blocks0,
      },
      content: {
        type: "Table",
        title: richTextConverter(database.title),
        headers: dataProperties
          .map((property) => {
            const { header } = getHeader(property);
            return header;
          })
          .map(richTextFromString),
        content: query.results.map((row: any) =>
          dataProperties.map((col) => {
            const data = row.properties[col] as any;
            const notionRichText = data["title"] || data["rich_text"];
            if (!notionRichText) {
              throw Error(
                `Can't parse data in table: ${database.id} - ${block0.child_database.title}`
              );
            } else {
              return richTextConverter(notionRichText);
            }
          })
        ),
      },
    };
  }
};

const orderedListItemParser: ContentParser<ListItem> = async (context) => {
  const { blocks } = context;
  const [block0, ...blocks0] = blocks;
  if (block0.type === "numbered_list_item") {
    return {
      context: {
        ...context,
        blocks: blocks0,
      },
      content: {
        type: "ListItem",
        text: richTextConverter(block0.numbered_list_item.text),
        children: block0.has_children
          ? (
              await arrayParserCombiner(contentParser)({
                ...context,
                blocks: (await context.fetchChildren(block0.id))?.results ?? [],
              })
            )?.content ?? null
          : null,
      },
    };
  } else {
    return null;
  }
};

const listParser: ContentParser<List> = async (context) => {
  const numberedItemResult = await arrayParserCombiner(orderedListItemParser)(
    context
  );
  if (numberedItemResult && numberedItemResult.content.length !== 0) {
    const { content, context } = numberedItemResult;
    return {
      content: {
        type: "List",
        kind: "ordered",
        items: content,
      },
      context,
    };
  } else {
    return null;
  }
};

const contentParser: ContentParser<ContentBlock> = async (context) => {
  return (
    (await sectionParser(context)) ||
    (await paragraphParser(context)) ||
    (await figureParser(context)) ||
    (await tableParser(context)) ||
    (await listParser(context))
  );
};

export const parse = async ({
  blocks,
  fetchImage,
  saveImage,
  fetchTable,
  fetchChildren,
}: Pick<
  ContentParserContext,
  "blocks" | "fetchImage" | "saveImage" | "fetchTable" | "fetchChildren"
>): Promise<Array<Section>> => {
  const parserResult = await arrayParserCombiner(sectionParser)({
    blocks,
    sectionLevel: 0,
    fetchImage,
    saveImage,
    fetchTable,
    fetchChildren,
  });
  if (parserResult) {
    return parserResult.content;
  } else {
    return [];
  }
};
