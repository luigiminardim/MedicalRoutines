import { GetAuthorsUseCase, IGetAuthorsGateway } from "./authors";
import {
  GetRoutinesUseCase,
  IGetRoutinesGateway,
  GetRoutineUseCase,
  IGetRoutineGateway,
  GetRoutineContentUseCase,
  IGetRoutineContentGateway,
} from "./routines";
import { GetCategoriesUseCase, IGetCategoriesGateway } from "./categories";

export const createUseCases = (
  getAuthorsGateway: IGetAuthorsGateway,
  getCategoriesGateway: IGetCategoriesGateway,
  getRoutineGateway: IGetRoutineGateway,
  getRoutinesGateway: IGetRoutinesGateway,
  getRoutineContentGateway: IGetRoutineContentGateway
) => {
  const getAuthorsUseCase = new GetAuthorsUseCase(getAuthorsGateway);

  const getCategoriesUseCase = new GetCategoriesUseCase(getCategoriesGateway);

  const getRoutineUseCase = new GetRoutineUseCase(getRoutineGateway);
  const getRoutinesUseCase = new GetRoutinesUseCase(getRoutinesGateway);
  const getRoutinesContentUseCase = new GetRoutineContentUseCase(
    getRoutineContentGateway
  );

  return {
    getAuthorsUseCase,
    getCategoriesUseCase,
    getRoutineUseCase,
    getRoutinesUseCase,
    getRoutinesContentUseCase,
  };
};
