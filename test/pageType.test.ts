import { describe, expect, it } from "vitest";
import { FolderPage } from "../src/pageType";

const page = (slug: string) => [{}, { data: { slug } }];

describe("FolderPage generate", () => {
  it("makes no folder pages for nested tag pages", () => {
    // tag-page's virtual pages, which reach page types that run after it as content
    const content = [page("notes/sub/a"), page("tags/plugin"), page("tags/plugin/filter")];
    const pages = FolderPage().generate!({ content, cfg: {}, ctx: {} } as never);
    expect(pages.map((p) => p.slug).sort()).toEqual(["notes/index", "notes/sub/index"]);
  });
});
