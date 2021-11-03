import { Routine } from "../entities/Routine";
import { IRoutineRepository } from "../interfaces/IRoutineRepository";

export class GetRoutineUseCase {
  constructor(private routineRepository: IRoutineRepository) {}

  public async getRoutine(id: Routine["id"]): Promise<Routine | null> {
    const routine = await this.routineRepository.getRoutine(id);
    return routine;
  }
}
