// pages/api/example.ts
import { api, ApiController } from "next-controller";
import { getRoutinesUseCase } from "../../main";

@api
export default class RoutinesController extends ApiController {
  /** Handles GET request. */
  override async get() {
    const { res } = this;
    const _1week = 7 * 24 * 60 * 60;
    res.setHeader(
      "Cache-Control",
      `s-max-age=${_1week}, stale-while-revalidate`
    );
    const routines = await getRoutinesUseCase.getRoutines({});
    return routines;
  }
}
