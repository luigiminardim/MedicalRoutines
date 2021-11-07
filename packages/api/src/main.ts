import {
  createUseCases,
  IAuthorsRepository,
  ICategoryRepository,
} from "@monorepo/domain";
import { createDataLayer } from "./data/createDataLayer";

const { routinesRepository } = createDataLayer();
export const {
  getAuthorsUseCase,
  getCategoriesUseCase,
  getRoutineUseCase,
  getRoutinesUseCase,
} = createUseCases(
  {} as IAuthorsRepository,
  {} as ICategoryRepository,
  routinesRepository
);
