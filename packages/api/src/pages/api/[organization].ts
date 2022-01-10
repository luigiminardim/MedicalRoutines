import { api, ApiController, use } from "next-controller";
import { maxAgeCacheControl } from "../../controllerLayer/utils/maxAgeCacheControl";
import { getOrganizationUseCase } from "../../main";

@api
export default class OrganizationController extends ApiController {
  @use(maxAgeCacheControl())
  override async get(query: { organization: string }) {
    const routines = await getOrganizationUseCase.getOrganization({
      organizationSlug: query.organization,
    });
    return routines;
  }
}
