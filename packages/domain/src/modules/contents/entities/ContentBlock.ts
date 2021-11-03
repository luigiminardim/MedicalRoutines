export type TextSpan = {
  type: "TextSpan";
  string: string;
  decorations: {
    bold: boolean;
    italic: boolean;
    underline: false;
    subscription: boolean;
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
  children: null | ContentBlock;
};

export type List = {
  type: "List";
  kind: "ordered" | "unordered";
  items: Array<ListItem>;
};

export type Figure = {
  type: "Figure";
  iamge: {
    base64: string;
  };
  caption: RichText;
};

export type Table = {
  type: "Table";
  headers: Array<ContentBlock>;
  content: Array<Array<ContentBlock>>;
  caption: RichText;
};

export type Section = {
  type: "Section";
  plainTitle: string;
  title: RichText;
  children: Array<ContentBlock>;
};

export type ContentBlock = RichText | List | Figure | Table | Section;
