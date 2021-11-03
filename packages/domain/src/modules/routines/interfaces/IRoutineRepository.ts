import { Routine } from "../entities/Routine";

export interface IRoutineRepository {
  getRoutine(id: Routine["id"]): Promise<Routine | null>;

  getRoutines(): Promise<Array<Routine>>;
}
