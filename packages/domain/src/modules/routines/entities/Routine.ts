import { Category } from "../../categories/entities/Category";
import { Section } from "../../contents/entities/ContentBlock";

export type Routine = {
  id: string;
  name: string;
  slug: string;
  categories: Array<Category>;
  tags: string[];
  sections: Array<Section>;
};
