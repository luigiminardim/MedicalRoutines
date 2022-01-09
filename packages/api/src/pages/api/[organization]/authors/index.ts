import { api, ApiController, use } from "next-controller";
import { maxAgeCacheControl } from "../../../../controllerLayer/utils/maxAgeCacheControl";
import { getAuthorsUseCase } from "../../../../main";

@api
export default class AuthorsController extends ApiController {
  @use(maxAgeCacheControl())
  override async get(query: { organization: string }) {
    const routines = await getAuthorsUseCase.getAuthors({
      organizationSlug: query.organization,
    });
    return routines;
  }
}
