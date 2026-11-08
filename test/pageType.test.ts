import { describe, expect, it } from "vitest";
import { VFile } from "vfile";
import type { BuildCtx, ProcessedContent } from "@quartz-community/types";
import { FolderPage } from "../src/pageType";

function page(slug: string, relativePath?: string): ProcessedContent {
  const file = new VFile("");
  file.data = { slug, relativePath, frontmatter: { title: slug } } as never;
  return [{ type: "root", children: [] }, file];
}

async function generatedSlugs(content: ProcessedContent[], virtualPages?: ProcessedContent[]) {
  const ctx = (virtualPages ? { virtualPages } : {}) as unknown as BuildCtx;
  const pages = await FolderPage().generate!({ content, cfg: {} as never, ctx });
  return pages.map((p) => p.slug).sort();
}

describe("FolderPage.generate", () => {
  it("generates folder pages for folders of markdown notes", async () => {
    expect(await generatedSlugs([page("notes/a", "notes/a.md")])).toEqual(["notes/index"]);
  });

  it("generates folder pages for folders holding only virtual pages (quartz#2576)", async () => {
    const virtual = [
      page("trips/map.base", "trips/map.base.md"),
      page("projects/2026/board.base", "projects/2026/board.base.md"),
    ];
    expect(await generatedSlugs([], virtual)).toEqual([
      "projects/2026/index",
      "projects/index",
      "trips/index",
    ]);
  });

  it("does not generate a folder page when a virtual page is the folder's index", async () => {
    const virtual = [page("trips/index", "trips/index.md"), page("trips/map.base")];
    expect(await generatedSlugs([], virtual)).toEqual([]);
  });

  it("ignores tag pages", async () => {
    const virtual = [page("tags/a/b", "tags/a/b.md"), page("tags/index", "tags/index.md")];
    expect(await generatedSlugs([], virtual)).toEqual([]);
  });

  it("works without ctx.virtualPages", async () => {
    expect(await generatedSlugs([page("a/b", "a/b.md")], undefined)).toEqual(["a/index"]);
  });
});
