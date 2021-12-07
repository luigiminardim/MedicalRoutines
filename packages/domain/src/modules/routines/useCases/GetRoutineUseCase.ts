import { Routine } from "../entities/Routine";

export type GetRoutineDtoInput = {
  id: string;
};

export interface IGetRoutineGateway {
  getRoutine(input: GetRoutineDtoInput): Promise<Routine | null>;
}

export class GetRoutineUseCase {
  constructor(private routineGateway: IGetRoutineGateway) {}

  public async getRoutine(input: GetRoutineDtoInput): Promise<Routine | null> {
    const routine = await this.routineGateway.getRoutine(input);
    return routine;
  }
}
