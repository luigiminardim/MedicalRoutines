import { api, ApiController, use } from "next-controller";
import { maxAgeCacheControl } from "../../../../../controllerLayer/utils/maxAgeCacheControl";
import { getRoutinesContentUseCase } from "../../../../../main";

@api
export default class RoutineController extends ApiController {
  @use(maxAgeCacheControl())
  override async get(query: { routine: string }) {
    const routines = await getRoutinesContentUseCase.getRoutineContent({
      routineSlug: query.routine,
    });
    return routines;
  }
}
