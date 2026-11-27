import { describe, expect, it } from "vitest";
import { VFile } from "vfile";
import type { BuildCtx, ProcessedContent } from "@quartz-community/types";
import FolderContent, { pagesFromAllFiles } from "../src/components/FolderContent";
import { FolderPage } from "../src/pageType";

type VNode = { type: unknown; props: Record<string, unknown> & { children?: unknown } };
const textOf = (node: unknown): string =>
  node === null || node === undefined || typeof node === "boolean"
    ? ""
    : typeof node === "string" || typeof node === "number"
      ? String(node)
      : Array.isArray(node)
        ? node.map(textOf).join("")
        : typeof (node as VNode).type === "function"
          ? textOf(((node as VNode).type as (p: unknown) => unknown)((node as VNode).props))
          : textOf((node as VNode).props.children);

const day = (d: string) => new Date(`${d}T00:00:00Z`);
const dates = (d: string) => ({ created: day(d), modified: day(d), published: day(d) });

describe("pagesFromAllFiles", () => {
  it("places a page with a permalink in its folder, by its file path", () => {
    const files = [
      { slug: "elsewhere/moved", relativePath: "notes/moved.md", frontmatter: { title: "M" } },
      { slug: "notes/stays", relativePath: "notes/stays.md", frontmatter: { title: "S" } },
    ];
    expect(pagesFromAllFiles(files, "notes/index", true).map((p) => p.slug)).toEqual([
      "elsewhere/moved",
      "notes/stays",
    ]);
    expect(pagesFromAllFiles(files, "elsewhere/index", true)).toEqual([]);
  });

  it("lists a subfolder without an index page once, dated by its newest page", () => {
    const files = [
      { slug: "notes/sub/a", frontmatter: { title: "A" }, dates: dates("2024-01-01") },
      { slug: "notes/sub/deep/b", frontmatter: { title: "B" }, dates: dates("2025-06-01") },
      { slug: "notes/sub/c", frontmatter: { title: "C" }, dates: dates("2023-01-01") },
    ];
    const [sub, ...rest] = pagesFromAllFiles(files, "notes/index", true);
    expect(rest).toEqual([]);
    expect(sub).toMatchObject({
      slug: "notes/sub/index",
      frontmatter: { title: "sub", tags: [] },
      dates: dates("2025-06-01"),
    });
  });

  it("leaves out subfolders with showSubfolders off", () => {
    const files = [
      { slug: "notes/a", frontmatter: { title: "A" } },
      { slug: "notes/sub/b", frontmatter: { title: "B" } },
    ];
    expect(pagesFromAllFiles(files, "notes/index", false).map((p) => p.slug)).toEqual(["notes/a"]);
    expect(pagesFromAllFiles(files, "notes/index", true).map((p) => p.slug)).toEqual([
      "notes/a",
      "notes/sub/index",
    ]);
  });

  it("leaves out a subfolder whose index note is unlisted", () => {
    const files = [
      { slug: "notes/a", frontmatter: { title: "A" } },
      { slug: "notes/hidden/index", frontmatter: { title: "H" }, unlisted: true },
      { slug: "notes/hidden/c", frontmatter: { title: "C" } },
    ];
    expect(pagesFromAllFiles(files, "notes/index", true).map((p) => p.slug)).toEqual(["notes/a"]);
  });

  it("leaves out a subfolder holding only unlisted pages", () => {
    const files = [
      { slug: "notes/a", frontmatter: { title: "A" } },
      { slug: "notes/hidden/c", frontmatter: { title: "C" }, unlisted: true },
    ];
    expect(pagesFromAllFiles(files, "notes/index", true).map((p) => p.slug)).toEqual(["notes/a"]);
  });

  it("dates a subfolder without an index note by its newest listed page", () => {
    const files = [
      { slug: "notes/sub/a", dates: dates("2025-01-01"), defaultDateType: "modified" },
      {
        slug: "notes/sub/b",
        dates: dates("2026-01-01"),
        defaultDateType: "modified",
        unlisted: true,
      },
    ];
    const [sub] = pagesFromAllFiles(files, "notes/index", true);
    expect(sub).toMatchObject({ slug: "notes/sub/index", defaultDateType: "modified" });
    expect(sub!.dates!.modified).toEqual(day("2025-01-01"));
  });

  it("reads the folder from a slug with or without /index or a trailing slash", () => {
    const files = [{ slug: "notes/a", frontmatter: { title: "A" } }];
    for (const slug of ["notes/index", "notes/", "notes"]) {
      expect(pagesFromAllFiles(files, slug, true).map((p) => p.slug)).toEqual(["notes/a"]);
    }
  });
});

describe("FolderContent", () => {
  const trieNode = (
    slug: string,
    data: unknown,
    children: unknown[] = [],
    displayName = slug.split("/").slice(-2, -1)[0] ?? slug,
  ) => ({
    slug,
    data,
    children,
    isFolder: children.length > 0,
    displayName,
    findNode: () => undefined,
  });

  const render = (props: Record<string, unknown>, opts = {}) =>
    FolderContent(opts)({
      cfg: { locale: "en-US" },
      fileData: { slug: "notes/index" },
      tree: { type: "root", children: [] },
      allFiles: [],
      ...props,
    } as never);

  it("lists the folder's listed pages from the content trie, subfolders by name", () => {
    const sub = trieNode(
      "notes/sub/index",
      null,
      [
        trieNode("notes/sub/x", { slug: "notes/sub/x", dates: dates("2024-01-01") }),
        trieNode("notes/sub/y", { slug: "notes/sub/y", dates: dates("2026-01-01") }),
      ],
      "Sub Folder",
    );
    const folder = trieNode("notes/index", null, [
      trieNode("notes/a", { slug: "notes/a", frontmatter: { title: "A page" } }),
      trieNode("notes/secret", {
        slug: "notes/secret",
        frontmatter: { title: "Secret" },
        unlisted: true,
      }),
      sub,
    ]);
    const trie = {
      findNode: (path: string[]) => (path.join("/") === "notes/index" ? folder : undefined),
    };
    const text = textOf(render({ ctx: { trie } }));
    expect(text).toContain("2 items under this folder.");
    expect(text).toContain("A page");
    expect(text).toContain("Sub Folder");
    expect(text).not.toContain("Secret");
    expect(textOf(render({ ctx: { trie } }, { showSubfolders: false }))).toContain(
      "1 item under this folder.",
    );
  });

  it("shows a subfolder's newest date", () => {
    const sub = trieNode("notes/sub/index", null, [
      trieNode("notes/sub/y", {
        slug: "notes/sub/y",
        dates: dates("2026-01-01"),
        defaultDateType: "modified",
      }),
    ]);
    const folder = trieNode("notes/index", null, [sub]);
    const trie = { findNode: () => folder };
    expect(textOf(render({ ctx: { trie } }))).toContain("Jan 01, 2026");
  });

  it("shows no date for a subfolder whose pages have none", () => {
    const sub = trieNode("notes/sub/index", null, [
      trieNode("notes/sub/y", { slug: "notes/sub/y", frontmatter: { title: "Y" } }),
    ]);
    const folder = trieNode("notes/index", null, [sub]);
    expect(textOf(render({ ctx: { trie: { findNode: () => folder } } }))).not.toMatch(/\d{4}/);
  });

  it("orders subfolders by their newest date", () => {
    const sub = (name: string, d: string) =>
      trieNode(
        `notes/${name}/index`,
        null,
        [
          trieNode(`notes/${name}/y`, {
            slug: `notes/${name}/y`,
            dates: dates(d),
            defaultDateType: "modified",
          }),
        ],
        name,
      );
    const folder = trieNode("notes/index", null, [
      sub("Earlier", "2024-01-01"),
      sub("Later", "2026-01-01"),
    ]);
    const text = textOf(render({ ctx: { trie: { findNode: () => folder } } }));
    expect(text.indexOf("Later")).toBeLessThan(text.indexOf("Earlier"));
  });

  it("falls back to all files for a folder the trie doesn't have", () => {
    const allFiles = [{ slug: "notes/a", frontmatter: { title: "Only" } }];
    const text = textOf(render({ allFiles, ctx: { trie: { findNode: () => undefined } } }));
    expect(text).toContain("1 item under this folder.");
    expect(text).toContain("Only");
  });

  it("shows the folder note's content, or its description without one", () => {
    expect(
      textOf(render({ fileData: { slug: "notes/index", description: "About notes" } })),
    ).toContain("About notes");
    const tree = {
      type: "root",
      children: [
        {
          type: "element",
          tagName: "p",
          properties: {},
          children: [{ type: "text", value: "Body" }],
        },
      ],
    };
    expect(
      textOf(render({ tree, fileData: { slug: "notes/index", description: "About" } })),
    ).toMatch(/^Body/);
  });

  it("can hide the count, and carries the note's cssclasses", () => {
    const out = render(
      { fileData: { slug: "notes/index", frontmatter: { cssclasses: ["wide", "dark"] } } },
      { showFolderCount: false },
    ) as unknown as VNode;
    expect(textOf(out)).not.toContain("under this folder");
    const article = (out.props.children as VNode[])[0]!;
    expect(article.props.class).toBe("wide dark");
  });

  it("renders nothing without a slug", () => {
    expect(render({ fileData: {} })).toBeNull();
  });
});

function page(
  slug: string,
  relativePath?: string,
  extra: Record<string, unknown> = {},
): ProcessedContent {
  const file = new VFile("");
  file.data = { slug, relativePath, frontmatter: { title: slug }, ...extra } as never;
  return [{ type: "root", children: [] }, file];
}
const generate = (content: ProcessedContent[], opts = {}, locale?: string) =>
  FolderPage(opts).generate!({
    content,
    cfg: (locale ? { locale } : {}) as never,
    ctx: {} as unknown as BuildCtx,
  });

describe("generated folder pages", () => {
  it("are titled with the folder's name as written in the vault", async () => {
    const pages = await generate([page("my-notes/daily-log/a", "My Notes/Daily Log/a.md")]);
    expect(pages.map((p) => [p.slug, p.title]).sort()).toEqual([
      ["my-notes/daily-log/index", "Daily Log"],
      ["my-notes/index", "My Notes"],
    ]);
  });

  it("are prefixed with Folder: with prefixFolders", async () => {
    const pages = await generate([page("x/a", "X/a.md")], { prefixFolders: true });
    expect(pages[0]!.title).toBe("Folder: X");
  });

  it("are not made for folders holding only unlisted pages", async () => {
    expect(await generate([page("hidden/a", "hidden/a.md", { unlisted: true })])).toEqual([]);
  });

  it("title a folder's own index note without a title after the folder", async () => {
    const index = page("my-notes/index", "My Notes/index.md");
    (index[1].data as { frontmatter: { title: string } }).frontmatter.title = "index";
    const titled = page("other/index", "Other/index.md");
    await generate([index, titled, page("my-notes/a", "My Notes/a.md")], { prefixFolders: true });
    expect((index[1].data as { frontmatter: { title: string } }).frontmatter.title).toBe(
      "Folder: My Notes",
    );
    expect((titled[1].data as { frontmatter: { title: string } }).frontmatter.title).toBe(
      "other/index",
    );
  });

  it("are named after their own folder, also with pages that have a permalink", async () => {
    const pages = await generate([
      page("ideas/idea", "Drafts/Idea.md"),
      page("ideas/x", "Ideas/x.md"),
    ]);
    expect(pages.map((p) => [p.slug, p.title]).sort()).toEqual([
      ["drafts/index", "Drafts"],
      ["ideas/index", "Ideas"],
    ]);
  });

  it("names folders of the same name in different places each after its own path", async () => {
    const pages = await generate([
      page("a/notes/x", "A/Notes/x.md"),
      page("b/notes/y", "B/notes/y.md"),
    ]);
    expect(pages.map((p) => [p.slug, p.title]).sort()).toEqual([
      ["a/index", "A"],
      ["a/notes/index", "Notes"],
      ["b/index", "B"],
      ["b/notes/index", "notes"],
    ]);
  });
});
