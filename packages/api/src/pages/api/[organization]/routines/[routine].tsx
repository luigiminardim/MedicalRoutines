import { api, ApiController, use } from "next-controller";
import { maxAgeCacheControl } from "../../../../controllerLayer/utils/maxAgeCacheControl";
import { getRoutineUseCase } from "../../../../main";

@api
export default class RoutineController extends ApiController {
  @use(maxAgeCacheControl())
  override async get(query: { routine: string }) {
    const routines = await getRoutineUseCase.getRoutine({
      routineSlug: query.routine,
    });
    return routines;
  }
}
