import {
  GetAuthorsUseCase,
  IGetAuthorsGateway,
} from "./authors/useCases/GetAuthorsUseCases";
import {
  GetRoutinesUseCase,
  IGetRoutinesGateway,
} from "./routines/useCases/GetRoutinesUseCase";
import {
  GetCategoriesUseCase,
  IGetCategoriesGateway,
} from "./categories/useCases/GetCategoriesUseCase";
import {
  GetRoutineUseCase,
  IGetRoutineGateway,
} from "./routines/useCases/GetRoutineUseCase";

export const createUseCases = (
  getAuthorsGateway: IGetAuthorsGateway,
  getCategoriesGateway: IGetCategoriesGateway,
  getRoutineGateway: IGetRoutineGateway,
  getRoutinesGateway: IGetRoutinesGateway
) => {
  const getAuthorsUseCase = new GetAuthorsUseCase(getAuthorsGateway);

  const getCategoriesUseCase = new GetCategoriesUseCase(getCategoriesGateway);

  const getRoutineUseCase = new GetRoutineUseCase(getRoutineGateway);
  const getRoutinesUseCase = new GetRoutinesUseCase(getRoutinesGateway);

  return {
    getAuthorsUseCase,
    getCategoriesUseCase,
    getRoutineUseCase,
    getRoutinesUseCase,
  };
};
