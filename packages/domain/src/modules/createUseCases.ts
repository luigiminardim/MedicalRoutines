import { GetAuthorsUseCase } from "./authors/useCases/GetAuthorsUseCases";
import { GetRoutinesUseCase } from "./routines/useCases/GetRoutinesUseCase";
import { IRoutineRepository } from "./routines/interfaces/IRoutineRepository";
import { ICategoriesRepository } from "./categories/interfaces/ICategoriesRepository";
import { GetCategoriesUseCase } from "./categories/useCases/GetCategoriesUseCase";
import { GetRoutineUseCase } from "./routines/useCases/GetRoutineUseCase";
import { IAuthorsRepository } from "./authors/interfaces/IAuthorsRepository";

export const createUseCases = (
  authorsRepository: IAuthorsRepository,
  categoriesRepository: ICategoriesRepository,
  routinesRepository: IRoutineRepository
) => {
  const getAuthorsUseCase = new GetAuthorsUseCase(authorsRepository);

  const getCategoriesUseCase = new GetCategoriesUseCase(categoriesRepository);

  const getRoutineUseCase = new GetRoutineUseCase(routinesRepository);
  const getRoutinesUseCase = new GetRoutinesUseCase(routinesRepository);

  return {
    getAuthorsUseCase,
    getCategoriesUseCase,
    getRoutineUseCase,
    getRoutinesUseCase,
  };
};
