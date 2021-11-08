import { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";

/** https://api.notion.com/v1/databases/5ebe390563ab448aaec237febf1bb98d/query */
export const categoriesQueryMock: QueryDatabaseResponse = {
  object: "list",
  results: [
    {
      object: "page",
      id: "3cb1fb62-ff70-4ee8-bbaa-a58ccd45b757",
      created_time: "2021-10-24T14:47:00.000Z",
      last_edited_time: "2021-10-24T15:22:00.000Z",
      cover: null,
      icon: null,
      parent: {
        type: "database_id",
        database_id: "5ebe3905-63ab-448a-aec2-37febf1bb98d",
      },
      archived: false,
      properties: {
        routines: {
          id: "KX%5Ce",
          type: "relation",
          relation: [
            {
              id: "62ef44b1-5c06-4a7b-9812-e45960c9e4ce",
            },
          ],
        },
        color_theme: {
          id: "%5BWyz",
          type: "rich_text",
          rich_text: [
            {
              type: "text",
              text: {
                content: "60",
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default",
              },
              plain_text: "60",
              href: null,
            },
          ],
        },
        slug: {
          id: "bd%5Dv",
          type: "rich_text",
          rich_text: [
            {
              type: "text",
              text: {
                content: "endocrinologia",
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default",
              },
              plain_text: "endocrinologia",
              href: null,
            },
          ],
        },
        name: {
          id: "title",
          type: "title",
          title: [
            {
              type: "text",
              text: {
                content: "Endocrinologia",
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default",
              },
              plain_text: "Endocrinologia",
              href: null,
            },
          ],
        },
      },
      url: "https://www.notion.so/Endocrinologia-3cb1fb62ff704ee8bbaaa58ccd45b757",
    },
    {
      object: "page",
      id: "86af33fe-24e6-4ef8-90d5-83288d2b5015",
      created_time: "2021-10-24T14:47:00.000Z",
      last_edited_time: "2021-10-24T15:21:00.000Z",
      cover: null,
      icon: null,
      parent: {
        type: "database_id",
        database_id: "5ebe3905-63ab-448a-aec2-37febf1bb98d",
      },
      archived: false,
      properties: {
        routines: {
          id: "KX%5Ce",
          type: "relation",
          relation: [
            {
              id: "62ef44b1-5c06-4a7b-9812-e45960c9e4ce",
            },
          ],
        },
        color_theme: {
          id: "%5BWyz",
          type: "rich_text",
          rich_text: [
            {
              type: "text",
              text: {
                content: "30",
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default",
              },
              plain_text: "30",
              href: null,
            },
          ],
        },
        slug: {
          id: "bd%5Dv",
          type: "rich_text",
          rich_text: [
            {
              type: "text",
              text: {
                content: "emergencia",
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default",
              },
              plain_text: "emergencia",
              href: null,
            },
          ],
        },
        name: {
          id: "title",
          type: "title",
          title: [
            {
              type: "text",
              text: {
                content: "Emergência e Terapia Intensiva",
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default",
              },
              plain_text: "Emergência e Terapia Intensiva",
              href: null,
            },
          ],
        },
      },
      url: "https://www.notion.so/Emerg-ncia-e-Terapia-Intensiva-86af33fe24e64ef890d583288d2b5015",
    },
    {
      object: "page",
      id: "d61dc1c3-cd1b-49c9-89a6-bea258b3d25e",
      created_time: "2021-10-24T14:47:00.000Z",
      last_edited_time: "2021-11-07T19:03:00.000Z",
      cover: null,
      icon: null,
      parent: {
        type: "database_id",
        database_id: "5ebe3905-63ab-448a-aec2-37febf1bb98d",
      },
      archived: false,
      properties: {
        routines: {
          id: "KX%5Ce",
          type: "relation",
          relation: [
            {
              id: "62ef44b1-5c06-4a7b-9812-e45960c9e4ce",
            },
          ],
        },
        color_theme: {
          id: "%5BWyz",
          type: "rich_text",
          rich_text: [
            {
              type: "text",
              text: {
                content: "#BB342F",
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default",
              },
              plain_text: "#BB342F",
              href: null,
            },
          ],
        },
        slug: {
          id: "bd%5Dv",
          type: "rich_text",
          rich_text: [
            {
              type: "text",
              text: {
                content: "cardiologia",
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default",
              },
              plain_text: "cardiologia",
              href: null,
            },
          ],
        },
        name: {
          id: "title",
          type: "title",
          title: [
            {
              type: "text",
              text: {
                content: "Cardiologia",
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default",
              },
              plain_text: "Cardiologia",
              href: null,
            },
          ],
        },
      },
      url: "https://www.notion.so/Cardiologia-d61dc1c3cd1b49c989a6bea258b3d25e",
    },
  ],
  next_cursor: null,
  has_more: false,
};
