import { Category } from "../../categories/entities/Category";

export type GetRoutinesInput = {
  filters?: {
    categoryId?: Category["id"];
    search?: string;
  };
};
