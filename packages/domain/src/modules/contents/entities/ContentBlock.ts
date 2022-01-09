import { ImageRecord } from "./ImageRecord";

export type TextSpan = {
  type: "TextSpan";
  string: string;
  link: null | {
    type: "url";
    url: string;
  };
  decorations: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    subscript: boolean;
    color: null | string;
  };
};

export type RichText = {
  type: "RichText";
  spans: Array<TextSpan>;
};

export type ListItem = {
  type: "ListItem";
  text: RichText;
  children: null | Array<ContentBlock>;
};

export type List = {
  type: "List";
  kind: "ordered" | "unordered";
  items: Array<ListItem>;
};

export type Figure = {
  type: "Figure";
  image: ImageRecord;
  caption?: RichText;
};

export type Table = {
  type: "Table";
  title: RichText;
  headers: Array<RichText>;
  content: Array<Array<RichText>>;
};

export type Section = {
  type: "Section";
  plainTitle: string;
  title: RichText;
  children: Array<ContentBlock>;
};

export type ContentBlock = RichText | List | Figure | Table | Section;
