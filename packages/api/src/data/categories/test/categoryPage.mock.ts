import { GetPageResponse } from "@notionhq/client/build/src/api-endpoints";

export const categoryPageMock: GetPageResponse = {
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
};