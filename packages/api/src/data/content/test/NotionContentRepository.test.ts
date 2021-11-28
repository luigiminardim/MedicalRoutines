import { parse, ContentParserContext } from "./../parse";
import { Figure, RichText, Section, TextSpan, Table } from "@monorepo/domain";
import testRoutineWithParagraph from "./mocks/testRoutineWithParagraph.json";
import testRoutineWithSubsection from "./mocks/testRoutineWithSubsections.json";
import testRoutineWithRichText from "./mocks/testRoutineWithRichText.json";
import testRoutineWithFigure from "./mocks/testRoutineWithFigure.json";
import fs from "fs";

jest.setTimeout(10000 * 1000);

describe(parse, () => {
  const fetchImageMock: ContentParserContext["fetchImage"] = async (anyUrl) =>
    fs.readFileSync("packages/api/src/data/content/test/mocks/test image.png");
  it("should create section when reaching a heading_1", async () => {
    const sections = await parse(
      testRoutineWithParagraph.results,
      fetchImageMock
    );
    const expectedFirstSection: Partial<Section> = {
      title: {
        type: "RichText",
        spans: [
          {
            type: "TextSpan",
            string: "Parágrafo",
            decorations: {
              bold: false,
              color: null,
              italic: false,
              subscript: false,
              underline: false,
            },
          },
        ],
      },
    };
    const firstSection = sections[0];
    expect(firstSection).toMatchObject(expectedFirstSection);
  });

  it("should convert a page with one paragraph into a section with one paragraph", async () => {
    const sections = await parse(
      testRoutineWithParagraph.results,
      fetchImageMock
    );
    const expectedParagraph: RichText = {
      type: "RichText",
      spans: [
        {
          type: "TextSpan",
          string: "Seção com um parágrafo.",
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
    const paragraph = sections[0]?.children[0];
    expect(paragraph).toMatchObject(expectedParagraph);
  });

  it("should indentify sections and subsections", async () => {
    const sections = await parse(
      testRoutineWithSubsection.results,
      fetchImageMock
    );
    const expectedSection = {
      type: "Section",
      plainTitle: "Seção",
      children: [
        {
          type: "Section",
          plainTitle: "Subseção",
          children: [
            {
              type: "Section",
              plainTitle: "Sub-subseção",
              children: [{ type: "RichText" } as RichText],
            } as Section,
          ],
        } as Section,
      ],
    } as Section;
    expect(sections[0]).toMatchObject(expectedSection);
  });

  it("should convert paragraphs to rich text", async () => {
    const sections = await parse(
      testRoutineWithRichText.results,
      fetchImageMock
    );
    const expectedSection = {
      plainTitle: "Texto rico",
      children: [
        {
          type: "RichText",
          spans: [
            {
              string: "Itálico ",
              decorations: {
                italic: true,
              },
            } as TextSpan,
            {
              string: "negrito ",
              decorations: {
                bold: true,
              },
            } as TextSpan,
            {
              string: "subscrito",
              decorations: {
                subscript: true,
              },
            } as TextSpan,
          ],
        },
      ],
    } as Section;
    expect(sections[0]).toMatchObject(expectedSection);
  });

  it("should correctly convert figures", async () => {
    const sections = await parse(testRoutineWithFigure.results, fetchImageMock);
    const expectedSection = {
      plainTitle: "Figura",
      children: [
        {
          type: "Figure",
          image: {
            format: "png",
            height: 100,
            width: 200,
          },
          caption: {
            type: "RichText",
            spans: [{ type: "TextSpan", string: "Legenda da figura" }],
          },
        } as Figure,
      ],
    } as Section;
    expect(sections[0]).toMatchObject(expectedSection);
    await new Promise((resolve) => setTimeout(resolve, 4000));
  });

});
