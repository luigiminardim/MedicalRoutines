import { api, ApiController, use } from "next-controller";
import { maxAgeCacheControl } from "../../../../controllerLayer/utils/maxAgeCacheControl";
import { getCategoriesUseCase } from "../../../../main";

@api
export default class CategoriesController extends ApiController {
  @use(maxAgeCacheControl())
  override async get(query: { organization: string }) {
    const routines = await getCategoriesUseCase.getCategories({
      organizationSlug: query.organization,
    });
    return routines;
  }
}
