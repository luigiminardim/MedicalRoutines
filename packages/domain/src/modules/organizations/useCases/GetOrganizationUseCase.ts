import { Organization } from "../entities/Organization";

export type GetOrganizationInput = {
  organizationSlug: Organization["slug"];
};

export interface IGetOrganizationGateway {
  getOrganization(input: GetOrganizationInput): Promise<Organization>;
}

export class GetOrganizationUseCase {
  constructor(private getOrganizationGateway: IGetOrganizationGateway) {}

  public async getOrganization(
    input: GetOrganizationInput
  ): Promise<Organization> {
    const organization = await this.getOrganizationGateway.getOrganization({
      organizationSlug: input.organizationSlug,
    });
    return organization;
  }
}
