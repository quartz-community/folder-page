import type {
  QuartzPageTypePlugin,
  QuartzComponentConstructor,
  PageMatcher,
  FullSlug,
  VirtualPage,
} from "@quartz-community/types";
import FolderContentComponent from "./components/FolderContent";
import { i18n } from "./i18n";
import { joinSegments } from "./util/path";
import type { SortFn } from "./components/PageList";
import path from "path";

export interface FolderPageOptions {
  showFolderCount?: boolean;
  showSubfolders?: boolean;
  sort?: SortFn;
}

const folderMatcher: PageMatcher = ({ slug }) => {
  return slug.endsWith("/index");
};

function getFolders(slug: string): string[] {
  let folderName = path.dirname(slug ?? "");
  const parentFolderNames = [folderName];
  while (folderName !== ".") {
    folderName = path.dirname(folderName ?? "");
    parentFolderNames.push(folderName);
  }
  return parentFolderNames;
}

export const FolderPage: QuartzPageTypePlugin<FolderPageOptions> = (opts) => {
  const body: QuartzComponentConstructor = () => FolderContentComponent(opts);

  return {
    name: "FolderPage",
    priority: 10,
    match: folderMatcher,
    generate({ content, cfg }) {
      const allFiles = content.map((c) => c[1].data);
      const locale = (cfg as { locale?: string } | undefined)?.locale ?? "en-US";

      const folders = new Set<string>();
      for (const file of allFiles) {
        const slug = (file as { slug?: string } | undefined)?.slug;
        if (!slug) continue;
        const fileFolders = getFolders(slug).filter((f) => f !== "." && f !== "tags");
        for (const f of fileFolders) {
          folders.add(f);
        }
      }

      const foldersWithIndex = new Set<string>();
      for (const [, file] of content) {
        const slug = (file.data as { slug?: string } | undefined)?.slug;
        if (slug && slug.endsWith("/index")) {
          const folder = slug.slice(0, -"/index".length);
          foldersWithIndex.add(folder);
        }
      }

      const virtualPages: VirtualPage[] = [];
      for (const folder of folders) {
        if (foldersWithIndex.has(folder)) continue;

        const slug = joinSegments(folder, "index") as unknown as FullSlug;
        const title = `${i18n(locale).pages.folderContent.folder}: ${folder}`;

        virtualPages.push({
          slug,
          title,
          data: {},
        });
      }

      return virtualPages;
    },
    layout: "folder",
    body,
  };
};
