import { describe, expect, it } from "vitest";
import type { QuartzPluginData } from "@quartz-community/types";
import { PageList, byDateAndAlphabeticalFolderFirst } from "../src/components/PageList";

type VNode = { type: unknown; props: Record<string, unknown> & { children?: unknown } };

function all(node: unknown, test: (v: VNode) => boolean, out: VNode[] = []): VNode[] {
  if (Array.isArray(node)) node.forEach((n) => all(n, test, out));
  else if (node && typeof node === "object" && "props" in node) {
    const v = node as VNode;
    if (typeof v.type === "function")
      return all((v.type as (p: unknown) => unknown)(v.props), test, out);
    if (test(v)) out.push(v);
    all(v.props.children, test, out);
  }
  return out;
}
const textOf = (node: unknown): string =>
  node === null || node === undefined || typeof node === "boolean"
    ? ""
    : typeof node === "string" || typeof node === "number"
      ? String(node)
      : Array.isArray(node)
        ? node.map(textOf).join("")
        : textOf((node as VNode).props.children);

const day = (d: string) => new Date(`${d}T12:00:00Z`);
const page = (slug: string, title: string, date?: string, tags: string[] = []): QuartzPluginData =>
  ({
    slug,
    frontmatter: { title, tags },
    ...(date ? { dates: { created: day(date), modified: day(date), published: day(date) } } : {}),
    defaultDateType: "modified",
  }) as unknown as QuartzPluginData;

const sorted = (pages: QuartzPluginData[]) =>
  [...pages].sort(byDateAndAlphabeticalFolderFirst({})).map((p) => p.frontmatter?.title);

describe("folder listing order", () => {
  it("lists folders first, then pages newest first, then undated pages by title", () => {
    expect(
      sorted([
        page("n/b", "b"),
        page("n/old", "Old", "2020-01-01"),
        page("n/sub/index", "Sub", "2019-01-01"),
        page("n/A", "A"),
        page("n/new", "New", "2024-01-01"),
      ]),
    ).toEqual(["Sub", "New", "Old", "A", "b"]);
  });
});

describe("PageList", () => {
  const render = (allFiles: QuartzPluginData[], extra: Record<string, unknown> = {}) =>
    PageList({
      cfg: { locale: "en-US" },
      fileData: { slug: "notes/index" },
      allFiles,
      ...extra,
    } as never);

  it("links each page from the folder page, with its date and tags", () => {
    const tree = render([page("notes/sub/a", "A", "2024-03-05", ["x", "y/z"])]);
    const [link] = all(tree, (v) => v.type === "a" && v.props.class === "internal");
    expect(link!.props.href).toBe("../notes/sub/a");
    expect(textOf(link)).toBe("A");
    const [time] = all(tree, (v) => v.type === "time");
    expect(time!.props.dateTime).toBe("2024-03-05T12:00:00.000Z");
    expect(textOf(time)).toBe("Mar 05, 2024");
    const tags = all(tree, (v) => v.props.class === "internal tag-link");
    expect(tags.map((t) => [t.props.href, textOf(t)])).toEqual([
      ["../tags/x", "x"],
      ["../tags/y/z", "y/z"],
    ]);
  });

  it("shows no date for a page without one", () => {
    expect(all(render([page("notes/a", "A")]), (v) => v.type === "time")).toEqual([]);
  });

  it("shows the first `limit` pages, in the given order", () => {
    const pages = [page("notes/a", "A"), page("notes/b", "B"), page("notes/c", "C")];
    const titles = (tree: unknown) => all(tree, (v) => v.type === "h2").map((h) => textOf(h));
    const byTitleDesc = (a: QuartzPluginData, b: QuartzPluginData) =>
      (b.frontmatter?.title ?? "").localeCompare(a.frontmatter?.title ?? "");
    expect(titles(render(pages, { limit: 2, sort: byTitleDesc }))).toEqual(["C", "B"]);
    expect(titles(render(pages))).toEqual(["A", "B", "C"]);
  });
});
