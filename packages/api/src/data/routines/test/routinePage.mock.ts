import { GetPageResponse } from "@notionhq/client/build/src/api-endpoints";

/** https://api.notion.com/v1/pages/62ef44b1-5c06-4a7b-9812-e45960c9e4ce */
export const routinePageMock: GetPageResponse = {
  object: "page",
  id: "62ef44b1-5c06-4a7b-9812-e45960c9e4ce",
  created_time: "2021-10-23T15:23:00.000Z",
  last_edited_time: "2021-11-02T04:47:00.000Z",
  cover: null,
  icon: null,
  parent: {
    type: "database_id",
    database_id: "edfb99c1-a789-4667-b332-ab2e6d87fa1d",
  },
  archived: false,
  properties: {
    authors: {
      id: "%3FXcn",
      type: "relation",
      relation: [
        {
          id: "e766699f-b51f-40c4-8b82-f6b7124a4a56",
        },
        {
          id: "a0500b34-bcd2-48d8-a6e9-d0524940bd66",
        },
      ],
    },
    tags: {
      id: "YV%7Di",
      type: "multi_select",
      multi_select: [
        {
          id: "a0991dc0-6a99-44f7-859c-47cacf9b9603",
          name: "tag1",
          color: "blue",
        },
        {
          id: "f662687b-f266-4d6b-bceb-9fd88902135b",
          name: "tag2",
          color: "orange",
        },
        {
          id: "fe8e6e0d-6aa8-4561-a2c9-b9462e9f8e30",
          name: "tag3",
          color: "purple",
        },
        {
          id: "85507e14-86dd-4f48-a6fe-004884eeb731",
          name: "tag4",
          color: "gray",
        },
      ],
    },
    slug: {
      id: "tNOi",
      type: "rich_text",
      rich_text: [
        {
          type: "text",
          text: {
            content: "test-routine",
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
          plain_text: "test-routine",
          href: null,
        },
      ],
    },
    categories: {
      id: "%7BSwt",
      type: "relation",
      relation: [
        {
          id: "3cb1fb62-ff70-4ee8-bbaa-a58ccd45b757",
        },
        {
          id: "86af33fe-24e6-4ef8-90d5-83288d2b5015",
        },
        {
          id: "d61dc1c3-cd1b-49c9-89a6-bea258b3d25e",
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
            content: "Rotina Teste",
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
          plain_text: "Rotina Teste",
          href: null,
        },
      ],
    },
  },
  url: "https://www.notion.so/Rotina-Teste-62ef44b15c064a7b9812e45960c9e4ce",
};
