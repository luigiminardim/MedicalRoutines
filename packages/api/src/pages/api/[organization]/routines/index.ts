import { api, ApiController, use } from "next-controller";
import { maxAgeCacheControl } from "../../../../controllerLayer/utils/maxAgeCacheControl";
import { getRoutinesUseCase } from "../../../../main";

@api
export default class RoutinesController extends ApiController {
  @use(maxAgeCacheControl())
  override async get(query: { organization: string }) {
    const routines = await getRoutinesUseCase.getRoutines({
      organizationSlug: query.organization,
    });
    return routines;
  }
}
