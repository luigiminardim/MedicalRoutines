import { Author } from "../../authors";
import { Category } from "../../categories";
import { Section } from "../../contents/entities/ContentBlock";

export type Routine = {
  id: string;
  name: string;
  categories: Array<Category>;
  tags: string[];
  sections: Array<Section>;
  authors: Array<Author>;
};
