import { parse, ContentParserContext } from "../parse";
import { Figure, RichText, Section, TextSpan, Table } from "@monorepo/domain";
import testRoutineWithParagraph from "./mocks/testRoutineWithParagraph.json";
import testRoutineWithSubsection from "./mocks/testRoutineWithSubsections.json";
import testRoutineWithRichText from "./mocks/testRoutineWithRichText.json";
import testRoutineWithFigure from "./mocks/testRoutineWithFigure.json";
import testRoutineWithTable from "./mocks/testRoutineWithTable.json";
import testRoutineWithNumberedList from "./mocks/testRoutineWithNumberedList.json";
import listChildren1 from "./mocks/ListItemChildren7015eebd-3e1a-4e5a-8658-6865ea30d795.json";
import listChildren2 from "./mocks/LilstItemChildren289c3fff-e73e-4708-803a-537b95607ab4.json";
import testRoutineWithReferences from "./mocks/testRoutineWithReferences.json";
import queryTableMock from "./mocks/queryTable.json";
import retrieveTableMock from "./mocks/retrieveTable.json";
import fs from "fs";

describe(parse, () => {
  const fetchImageMock: ContentParserContext["fetchImage"] = async (anyUrl) =>
    fs.readFileSync("packages/api/src/data/content/test/mocks/test image.png");

  const fetchTableMock: ContentParserContext["fetchTable"] = async (anyUrl) =>
    ({ database: retrieveTableMock, query: queryTableMock } as any);

  const fetchChildren = async (blockId: string) =>
    blockId === "7015eebd-3e1a-4e5a-8658-6865ea30d795"
      ? listChildren1
      : blockId === "289c3fff-e73e-4708-803a-537b95607ab4"
      ? listChildren2
      : null;

  it("should create section when reaching a heading_1", async () => {
    const sections = await parse(
      testRoutineWithParagraph.results,
      fetchImageMock,
      fetchTableMock,
      fetchChildren
    );
    const expectedFirstSection: Partial<Section> = {
      title: {
        type: "RichText",
        spans: [
          {
            type: "TextSpan",
            string: "Parágrafo",
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
      },
    };
    const firstSection = sections[0];
    expect(firstSection).toMatchObject(expectedFirstSection);
  });

  it("should convert a page with one paragraph into a section with one paragraph", async () => {
    const sections = await parse(
      testRoutineWithParagraph.results,
      fetchImageMock,
      fetchTableMock,
      fetchChildren
    );
    const expectedParagraph: RichText = {
      type: "RichText",
      spans: [
        {
          type: "TextSpan",
          string: "Seção com um parágrafo.",
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
    const paragraph = sections[0]?.children[0];
    expect(paragraph).toMatchObject(expectedParagraph);
  });

  it("should indentify sections and subsections", async () => {
    const sections = await parse(
      testRoutineWithSubsection.results,
      fetchImageMock,
      fetchTableMock,
      fetchChildren
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
      fetchImageMock,
      fetchTableMock,
      fetchChildren
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
    const sections = await parse(
      testRoutineWithFigure.results,
      fetchImageMock,
      fetchTableMock,
      fetchChildren
    );
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
  });

  it("should correctly convert tables", async () => {
    const sections = await parse(
      testRoutineWithTable.results,
      fetchImageMock,
      fetchTableMock,
      fetchChildren
    );
    const expectedSection = {
      plainTitle: "Tabela",
      children: [
        {
          type: "Table",
          title: {
            type: "RichText",
            spans: [{ string: "Título da tabela" } as TextSpan],
          },
          headers: [
            {
              spans: [
                { string: "Título da Coluna Um Com um nome muito grande" },
              ],
            },
            {
              spans: [{ string: "Título da Coluna Dois" }],
            },
            {
              spans: [{ string: "Título da coluna Três" }],
            },
          ],
        } as Table,
      ],
    } as Section;
    const expectedContent_0_0 = {
      spans: [{ string: "Escreva com strings nas tabelas" }],
    };
    const expectedContent_0_1 = {
      spans: [
        { string: "Se necessário, use textos em " },
        { string: "negrito " },
        { string: "ou " },
        { string: "itálico" },
      ],
    };
    const expectedContent_2_2 = {
      spans: [{ string: "conteúdo" }],
    };
    expect(sections[0]).toMatchObject(expectedSection);
    expect((sections[0]?.children[0] as any).content[0][0]).toMatchObject(
      expectedContent_0_0
    );
    expect((sections[0]?.children[0] as any).content[0][1]).toMatchObject(
      expectedContent_0_1
    );
    expect((sections[0]?.children[0] as any).content[2][2]).toMatchObject(
      expectedContent_2_2
    );
  });

  it("should covert a numbered list", async () => {
    const sections = await parse(
      testRoutineWithNumberedList.results,
      fetchImageMock,
      fetchTableMock,
      fetchChildren
    );
    const expectedSection = {
      plainTitle: "Listas",
      children: [
        {
          type: "List",
          kind: "ordered",
          items: [
            {
              type: "ListItem",
              text: {
                type: "RichText",
                spans: [{ string: "Primeiro item da lista;" }],
              },
            },
            {
              type: "ListItem",
              text: {
                type: "RichText",
                spans: [
                  {
                    string:
                      "Item muito muito muito muito muito muito longo da lista;",
                  },
                ],
              },
              children: [
                {
                  type: "List",
                  kind: "ordered",
                  items: [
                    {
                      type: "ListItem",
                      text: {
                        type: "RichText",
                        spans: [{ string: "Lista interna à lista" }],
                      },
                      children: [
                        {
                          type: "List",
                          kind: "ordered",
                          items: [
                            {
                              type: "ListItem",
                              children: null,
                              text: { spans: [{ string: "Mais um nível;" }] },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    } as Section;
    expect(sections[0]).toMatchObject(expectedSection);
  });

  it("should create the references", async () => {
    const sections = await parse(
      testRoutineWithReferences.results,
      fetchImageMock,
      fetchTableMock,
      fetchChildren
    );
    const expectedSection = {
      plainTitle: "Referências",
      children: [
        {
          type: "List",
          kind: "ordered",
          items: [
            {
              type: "ListItem",
              text: {
                type: "RichText",
                spans: [
                  {
                    string:
                      "Farhat CK, Carvalho ES, Carvalho LH, Succi RC, editors. Infectologia Pediátrica. 3.ed. São Paulo: Atheneu; 2007.",
                  },
                ],
              },
            },
            {
              type: "ListItem",
              text: {
                type: "RichText",
                spans: [
                  {
                    string:
                      "Gomes, PB, Melo MOCB, Duarte MA, Torres MRF, Xavier AT (2011). Polietilenoglicol na constipação intestinal crônica funcional em crianças. Revista Paulista de Pediatria, 29(2),245-250. https://dx.doi.org/10.1590/S0103-05822011000200017",
                    link: {
                      type: "url",
                      url: "https://dx.doi.org/10.1590/S0103-05822011000200017",
                    },
                  },
                ],
              },
              children: null,
            },
          ],
        },
      ],
    } as Section;
    expect(sections[0]).toMatchObject(expectedSection);
  });
});
