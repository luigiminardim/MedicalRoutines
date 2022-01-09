import { Organization } from "../../organizations";
import { Author } from "../entities/Author";

export type GetAuthorsDtoInput = {
  organizationSlug: Organization["slug"];
};

export interface IGetAuthorsGateway {
  getAuthors(input: GetAuthorsDtoInput): Promise<Array<Author>>;
}

export class GetAuthorsUseCase {
  constructor(private authorsGateway: IGetAuthorsGateway) {}

  public async getAuthors(input: GetAuthorsDtoInput): Promise<Array<Author>> {
    const authors = await this.authorsGateway.getAuthors(input);
    return authors;
  }
}
