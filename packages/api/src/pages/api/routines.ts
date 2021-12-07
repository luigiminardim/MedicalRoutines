// pages/api/example.ts
import { api, ApiController } from "next-controller";
import { getRoutinesUseCase } from "../../main";

@api
export default class RoutinesController extends ApiController {
  /** Handles GET request. */
  override async get() {
    const routines = await getRoutinesUseCase.getRoutines({});
    return routines;
  }
}
