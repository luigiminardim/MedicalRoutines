import { Author } from "../entities/Author";
import { IAuthorsRepository } from "../interfaces/IAuthorsRepository";

export class GetAuthorsUseCase {
  constructor(private authorsRespository: IAuthorsRepository) {}

  public async getAuthors(): Promise<Array<Author>> {
    const authors = await this.authorsRespository.getAuthors();
    return authors;
  }
}
