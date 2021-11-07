import { GetPageResponse } from "@notionhq/client/build/src/api-endpoints";

export const authorPageMock: GetPageResponse = {
  object: "page",
  id: "a0500b34-bcd2-48d8-a6e9-d0524940bd66",
  created_time: "2021-10-24T14:47:00.000Z",
  last_edited_time: "2021-10-24T18:58:00.000Z",
  cover: null,
  icon: null,
  parent: {
    type: "database_id",
    database_id: "59a40af1-c992-46fd-a584-2e1e768ee131",
  },
  archived: false,
  properties: {
    "Related to Routines (authors)": {
      id: "KfjL",
      type: "relation",
      relation: [
        {
          id: "62ef44b1-5c06-4a7b-9812-e45960c9e4ce",
        },
      ],
    },
    avatar: {
      id: "M%3ES%3C",
      type: "files",
      files: [
        {
          name: "http://ft.unb.br/index.php?option=com_pessoas&view=pessoas&layout=perfil&id=99",
          type: "external",
          external: {
            url: "http://ft.unb.br/index.php?option=com_pessoas&view=pessoas&layout=perfil&id=99",
          },
        },
      ],
    },
    slug: {
      id: "Q%5CWl",
      type: "rich_text",
      rich_text: [
        {
          type: "text",
          text: {
            content: "ana-luiza",
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
          plain_text: "ana-luiza",
          href: null,
        },
      ],
    },
    lattes_curriculum: {
      id: "S%3Bf%60",
      type: "url",
      url: "http://lattes.cnpq.br/1989010115232505",
    },
    name: {
      id: "title",
      type: "title",
      title: [
        {
          type: "text",
          text: {
            content: "Ana Luiza M. dos Santos",
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
          plain_text: "Ana Luiza M. dos Santos",
          href: null,
        },
      ],
    },
  },
  url: "https://www.notion.so/Ana-Luiza-M-dos-Santos-a0500b34bcd248d8a6e9d0524940bd66",
};
