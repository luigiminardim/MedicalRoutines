import { createUseCases, ICategoryRepository } from "@monorepo/domain";
import { createDataLayer } from "./data/createDataLayer";

const { authorsRepository, routinesRepository } = createDataLayer();
export const {
  getAuthorsUseCase,
  getCategoriesUseCase,
  getRoutineUseCase,
  getRoutinesUseCase,
} = createUseCases(
  authorsRepository,
  {} as ICategoryRepository,
  routinesRepository
);
