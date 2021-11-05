import { Routine } from "@monorepo/domain";
import { PageBuilder } from "../RoutineBuilder";
import { pageResponseMock } from "./pageResponse.mock";

describe(PageBuilder, () => {
  it("should build a Routine using a PageResponse", async () => {
    const pageBuilder = new PageBuilder();
    expect(await pageBuilder.buildPage(pageResponseMock)).toMatchObject({
      id: "62ef44b1-5c06-4a7b-9812-e45960c9e4ce",
      name: "Rotina Teste",
      slug: "test-routine",
      tags: ["tag1", "tag2", "tag3", "tag4"],
      categories: [],
      sections: [],
    } as Routine);
  });
});
