import { createUseCases } from "@monorepo/domain";
import { createDataLayer } from "./data/createDataLayer";

const { authorsRepository, categoriesRepository, routinesRepository } =
  createDataLayer();
export const {
  getAuthorsUseCase,
  getCategoriesUseCase,
  getRoutineUseCase,
  getRoutinesUseCase,
} = createUseCases(authorsRepository, categoriesRepository, routinesRepository);
