import { parse } from "./../parse";
import { Figure, RichText, Section, TextSpan } from "@monorepo/domain";
import testRoutineWithParagraph from "./testRoutineWithParagraph.json";
import testRoutineWithSubsection from "./testRoutineWithSubsections.json";
import testRoutineWithRichText from "./testRoutineWithRichText.json";
import testRoutineWithFigure from "./testRoutineWithFigure.json";

jest.setTimeout(10000 * 1000);

describe(parse, () => {
  describe("getSections", () => {
    it("should create section when reaching a heading_1", async () => {
      const sections = await parse(testRoutineWithParagraph.results);
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
      const sections = await parse(testRoutineWithParagraph.results);
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
      const sections = await parse(testRoutineWithSubsection.results);
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
      const sections = await parse(testRoutineWithRichText.results);
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
      const sections = await parse(testRoutineWithFigure.results);
      const expectedSection = {
        plainTitle: "Figura",
        children: [
          {
            type: "Figure",
            image: { base64: expect.anything() },
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
});