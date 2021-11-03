import { Category } from "../../categories/entities/Category";
import { GetRoutinesInput } from "../dto/GetRoutinesInput";
import { Routine } from "../entities/Routine";
import { IRoutineRepository } from "../interfaces/IRoutineRepository";

type RoutineSearchClassification = {
  routine: Routine;
  categories: Category[];
  idxFindedName: number;
  minimumIdxFindedCategoryName: number;
  findedTags: string[];
};

type RoutineFilter = (fp: RoutineSearchClassification) => boolean;

type RoutineSorter = (
  rsc1: RoutineSearchClassification,
  rsc2: RoutineSearchClassification
) => number;

const normalizeString = (s: string): string =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const findSearch = (text: string, search: string): number =>
  normalizeString(text).indexOf(normalizeString(search));

const categoryFilter =
  (categoryId: Category["id"] | null): RoutineFilter =>
  (rsc) =>
    !categoryId ||
    rsc.categories.some((category) => category.id === categoryId);

const searchFilter: RoutineFilter = (rsc) =>
  rsc.idxFindedName !== Infinity ||
  rsc.minimumIdxFindedCategoryName !== Infinity ||
  rsc.findedTags.length > 0;

const alphabeticSorter: RoutineSorter = (rsc1, rsc2) =>
  rsc1.routine.name.localeCompare(rsc2.routine.name, undefined, {
    sensitivity: "accent",
  });

const classifyRoutines =
  (filters: GetRoutinesInput["filters"]) =>
  (routine: Routine): RoutineSearchClassification => ({
    routine,
    categories: routine.categories,
    idxFindedName: findSearch(routine.name, filters?.search ?? ""),
    minimumIdxFindedCategoryName: Math.min(
      ...routine.categories
        .map((category) => findSearch(category.name, filters?.search ?? ""))
        .filter((idx) => idx >= 0)
    ),
    findedTags: routine.tags.filter(
      (tag) => findSearch(tag, filters?.search ?? "") !== -1
    ),
  });

function searchRoutines(
  routines: Array<Routine>,
  filters: GetRoutinesInput["filters"]
): Array<Routine> {
  const filter: RoutineFilter = [
    categoryFilter(filters?.categoryId ?? null),
    searchFilter,
  ].reduce(
    (resultFilter, partialFilter) => (fp) =>
      resultFilter(fp) && partialFilter(fp),
    () => true
  );
  const sorter: RoutineSorter = [alphabeticSorter].reduce(
    (resultSort, partialSorter) => (fp1, fp2) =>
      resultSort(fp1, fp2) !== 0
        ? resultSort(fp1, fp2)
        : partialSorter(fp1, fp2),
    () => 0
  );
  const classifier = classifyRoutines(filters);
  return routines
    .map(classifier)
    .filter(filter)
    .sort(sorter)
    .map(({ routine }) => routine);
}

export class GetRoutinesUseCase {
  constructor(private routineRepository: IRoutineRepository) {}

  public async getRoutines(input: GetRoutinesInput): Promise<Array<Routine>> {
    const routines = await this.routineRepository
      .getRoutines()
      .then((routines) => searchRoutines(routines, input.filters));
    return routines;
  }
}
