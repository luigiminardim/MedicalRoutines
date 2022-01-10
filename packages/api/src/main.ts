import { createUseCases } from "@monorepo/domain";
import { createDataLayer } from "./dataLayer/createDataLayer";

const {
  organizationRepository,
  authorsRepository,
  categoriesRepository,
  routinesRepository,
} = createDataLayer();

export const {
  getOrganizationUseCase,
  getAuthorsUseCase,
  getCategoriesUseCase,
  getRoutineUseCase,
  getRoutinesUseCase,
  getRoutinesContentUseCase,
} = createUseCases(
  organizationRepository,
  authorsRepository,
  categoriesRepository,
  routinesRepository,
  routinesRepository,
  routinesRepository
);
