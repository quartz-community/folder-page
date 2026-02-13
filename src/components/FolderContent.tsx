import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types";
import { PageList } from "./PageList";
import type { SortFn } from "./PageList";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { jsx, jsxs, Fragment } from "preact/jsx-runtime";
import type { ComponentChildren } from "preact";
import type { Root } from "hast";
import { i18n } from "../i18n";
import style from "./styles/listPage.scss";

interface FolderContentOptions {
  showFolderCount: boolean;
  showSubfolders: boolean;
  sort?: SortFn;
}

const defaultOptions: FolderContentOptions = {
  showFolderCount: true,
  showSubfolders: true,
};

interface TrieNode {
  isFolder: boolean;
  children: TrieNode[];
  data: unknown;
  slug: string;
  displayName: string;
  findNode(path: string[]): TrieNode | undefined;
}

function concatenateResources(
  ...resources: (string | string[] | undefined)[]
): string | string[] | undefined {
  const result = resources.filter((r): r is string | string[] => r !== undefined).flat();
  return result.length === 0 ? undefined : result;
}

export default ((opts?: Partial<FolderContentOptions>) => {
  const options: FolderContentOptions = { ...defaultOptions, ...opts };

  const FolderContent: QuartzComponent = (props: QuartzComponentProps) => {
    const { tree, fileData, cfg } = props;
    const ctx = props.ctx as { trie?: TrieNode } | undefined;

    const trie = ctx?.trie;
    const slug = (fileData as { slug?: string } | undefined)?.slug;

    if (!trie || !slug) {
      return null;
    }

    const folder = trie.findNode(slug.split("/"));
    if (!folder) {
      return null;
    }

    type PageEntry = {
      slug?: string;
      dates?: { created: Date; modified: Date; published: Date };
      frontmatter?: { title?: string; tags?: string[] };
    };

    const allPagesInFolder: PageEntry[] =
      folder.children
        .map((node) => {
          const nodeData = node.data as PageEntry | null;

          if (nodeData) return nodeData;
          if (node.isFolder && options.showSubfolders) {
            const getMostRecentDates = (): {
              created: Date;
              modified: Date;
              published: Date;
            } => {
              let maybeDates: { created: Date; modified: Date; published: Date } | undefined;
              for (const child of node.children) {
                const childDates = (child.data as { dates?: PageEntry["dates"] } | null)?.dates;
                if (childDates) {
                  if (!maybeDates) {
                    maybeDates = { ...childDates };
                  } else {
                    if (childDates.created > maybeDates.created)
                      maybeDates.created = childDates.created;
                    if (childDates.modified > maybeDates.modified)
                      maybeDates.modified = childDates.modified;
                    if (childDates.published > maybeDates.published)
                      maybeDates.published = childDates.published;
                  }
                }
              }
              return (
                maybeDates ?? {
                  created: new Date(),
                  modified: new Date(),
                  published: new Date(),
                }
              );
            };
            return {
              slug: node.slug,
              dates: getMostRecentDates(),
              frontmatter: { title: node.displayName, tags: [] },
            };
          }
          return undefined;
        })
        .filter((page): page is PageEntry => page !== undefined) ?? [];

    const cssClasses =
      ((fileData as { frontmatter?: { cssclasses?: string[] } } | undefined)?.frontmatter
        ?.cssclasses as string[] | undefined) ?? [];
    const classes = cssClasses.join(" ");
    const listProps = {
      ...props,
      sort: options.sort,
      allFiles: allPagesInFolder,
    };

    const hastRoot = tree as Root;
    const content =
      hastRoot.children.length === 0
        ? (fileData as { description?: unknown } | undefined)?.description
        : toJsxRuntime(hastRoot, {
            Fragment,
            jsx: jsx as any,
            jsxs: jsxs as any,
            elementAttributeNameCase: "html",
          });

    const pageListContent = PageList(listProps) as unknown as ComponentChildren;

    return (
      <div class="popover-hint">
        <article class={classes}>{content}</article>
        <div class="page-listing">
          {options.showFolderCount && (
            <p>
              {i18n(
                (cfg as { locale?: string } | undefined)?.locale ?? "en-US",
              ).pages.folderContent.itemsUnderFolder({
                count: allPagesInFolder.length,
              })}
            </p>
          )}
          <div>{pageListContent}</div>
        </div>
      </div>
    );
  };

  FolderContent.css = concatenateResources(style, PageList.css);
  return FolderContent;
}) satisfies QuartzComponentConstructor;
