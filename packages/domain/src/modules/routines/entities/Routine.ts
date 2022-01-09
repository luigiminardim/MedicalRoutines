import { Author } from "../../authors";
import { Category } from "../../categories";

export type Routine = {
  slug: string;
  name: string;
  categories: Array<Category>;
  tags: string[];
  authors: Array<Author>;
};
