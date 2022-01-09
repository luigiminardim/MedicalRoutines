import { createUseCases } from "@monorepo/domain";
import { createDataLayer } from "./dataLayer/createDataLayer";

const { authorsRepository, categoriesRepository, routinesRepository } =
  createDataLayer();
export const {
  getAuthorsUseCase,
  getCategoriesUseCase,
  getRoutineUseCase,
  getRoutinesUseCase,
  getRoutinesContentUseCase,
} = createUseCases(
  authorsRepository,
  categoriesRepository,
  routinesRepository,
  routinesRepository,
  routinesRepository
);
