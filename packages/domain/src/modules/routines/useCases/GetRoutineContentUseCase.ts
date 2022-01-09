import { Section } from "../../contents";
import { Routine } from "../entities/Routine";

export type GetRoutineContentInput = {
  routineSlug: Routine["slug"];
};

export interface IGetRoutineContentGateway {
  getRoutineContent(input: GetRoutineContentInput): Promise<Array<Section>>;
}

export class GetRoutineContentUseCase {
  constructor(private routineGateway: IGetRoutineContentGateway) {}

  public async getRoutineContent(
    input: GetRoutineContentInput
  ): Promise<Array<Section>> {
    const sections = await this.routineGateway.getRoutineContent(input);
    return sections;
  }
}
