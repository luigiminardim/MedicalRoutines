import { createUseCases } from "@monorepo/domain";
import { createDataLayer } from "./dataLayer/createDataLayer";

const { authorsRepository, categoriesRepository, routinesRepository } =
  createDataLayer();
export const {
  getAuthorsUseCase,
  getCategoriesUseCase,
  getRoutineUseCase,
  getRoutinesUseCase,
} = createUseCases(
  authorsRepository,
  categoriesRepository,
  routinesRepository,
  routinesRepository
);
