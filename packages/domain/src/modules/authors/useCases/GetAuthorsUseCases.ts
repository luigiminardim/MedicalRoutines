import { Author } from "../entities/Author";
export interface IGetAuthorsGateway {
  getAuthors(): Promise<Array<Author>>;
}

export class GetAuthorsUseCase {
  constructor(private authorsGateway: IGetAuthorsGateway) {}

  public async getAuthors(): Promise<Array<Author>> {
    const authors = await this.authorsGateway.getAuthors();
    return authors;
  }
}
