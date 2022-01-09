import { Category } from "../../categories/entities/Category";
import { Organization } from "../../organizations";
import { Routine } from "../entities/Routine";

type GetRoutinesDtoInput = {
  organizationSlug: Organization["slug"];
  filters?: {
    search?: string;
    categoryId?: Category["slug"];
  };
};

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
  (categorySlug: Category["slug"] | null): RoutineFilter =>
  (rsc) =>
    !categorySlug ||
    rsc.categories.some((category) => category.slug === categorySlug);

const searchFilter: RoutineFilter = (rsc) =>
  rsc.idxFindedName !== Infinity ||
  rsc.minimumIdxFindedCategoryName !== Infinity ||
  rsc.findedTags.length > 0;

const alphabeticSorter: RoutineSorter = (rsc1, rsc2) =>
  rsc1.routine.name.localeCompare(rsc2.routine.name, undefined, {
    sensitivity: "accent",
  });

const classifyRoutines =
  (filters: GetRoutinesDtoInput["filters"]) =>
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
  filters: GetRoutinesDtoInput["filters"]
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

export type GetRoutinesGatewayInput = {
  organizationSlug: Organization["slug"];
};

export interface IGetRoutinesGateway {
  getRoutines(input: GetRoutinesGatewayInput): Promise<Array<Routine>>;
}

export class GetRoutinesUseCase {
  constructor(private routinesGateway: IGetRoutinesGateway) {}

  public async getRoutines(
    input: GetRoutinesDtoInput
  ): Promise<Array<Routine>> {
    const routines = await this.routinesGateway
      .getRoutines({ organizationSlug: input.organizationSlug })
      .then((routines) => searchRoutines(routines, input.filters));
    return routines;
  }
}
