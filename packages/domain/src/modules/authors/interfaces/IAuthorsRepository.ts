import { Author } from "../entities/Author";

export interface IAuthorsRepository {
  getAuthors(): Promise<Array<Author>>;
}
