import { jsx, jsxs } from 'preact/jsx-runtime';
import { htmlToJsx } from '@quartz-community/utils/jsx';

// src/util/path.ts
function joinSegments(...args) {
  if (args.length === 0) return "";
  let joined = args.filter((segment) => segment !== "" && segment !== "/").map((segment) => stripSlashes(segment)).join("/");
  const first = args[0];
  const last = args[args.length - 1];
  if (first?.startsWith("/")) joined = "/" + joined;
  if (last?.endsWith("/")) joined = joined + "/";
  return joined;
}
function stripSlashes(s, onlyStripPrefix) {
  if (s.startsWith("/")) s = s.substring(1);
  if (!onlyStripPrefix && s.endsWith("/")) s = s.slice(0, -1);
  return s;
}
function simplifySlug(fp) {
  const res = stripSlashes(trimSuffix(fp, "index"), true);
  return res.length === 0 ? "/" : res;
}
function trimSuffix(s, suffix) {
  if (endsWith(s, suffix)) s = s.slice(0, -suffix.length);
  return s;
}
function endsWith(s, suffix) {
  return s === suffix || s.endsWith("/" + suffix);
}
function pathToRoot(slug) {
  let rootPath = slug.split("/").filter((x) => x !== "").slice(0, -1).map((_) => "..").join("/");
  if (rootPath.length === 0) rootPath = ".";
  return rootPath;
}
function resolveRelative(current, target) {
  return joinSegments(pathToRoot(current), simplifySlug(target));
}
function isFolderPath(fplike) {
  return fplike.endsWith("/") || endsWith(fplike, "index") || endsWith(fplike, "index.md") || endsWith(fplike, "index.html");
}
function getDate(cfg, data) {
  const type = cfg?.defaultDateType ?? "created";
  return data.dates?.[type];
}
function byDateAndAlphabetical(cfg) {
  return (f1, f2) => {
    if (f1.dates && f2.dates) {
      return (getDate(cfg, f2)?.getTime() ?? 0) - (getDate(cfg, f1)?.getTime() ?? 0);
    } else if (f1.dates && !f2.dates) {
      return -1;
    } else if (!f1.dates && f2.dates) {
      return 1;
    }
    const f1Title = f1.frontmatter?.title?.toLowerCase() ?? "";
    const f2Title = f2.frontmatter?.title?.toLowerCase() ?? "";
    return f1Title.localeCompare(f2Title);
  };
}
function byDateAndAlphabeticalFolderFirst(cfg) {
  return (f1, f2) => {
    const f1IsFolder = isFolderPath(f1.slug ?? "");
    const f2IsFolder = isFolderPath(f2.slug ?? "");
    if (f1IsFolder && !f2IsFolder) return -1;
    if (!f1IsFolder && f2IsFolder) return 1;
    if (f1.dates && f2.dates) {
      return (getDate(cfg, f2)?.getTime() ?? 0) - (getDate(cfg, f1)?.getTime() ?? 0);
    } else if (f1.dates && !f2.dates) {
      return -1;
    } else if (!f1.dates && f2.dates) {
      return 1;
    }
    const f1Title = f1.frontmatter?.title?.toLowerCase() ?? "";
    const f2Title = f2.frontmatter?.title?.toLowerCase() ?? "";
    return f1Title.localeCompare(f2Title);
  };
}
function DateDisplay({ date, locale }) {
  return /* @__PURE__ */ jsx("time", { dateTime: date.toISOString(), children: date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit"
  }) });
}
var PageList = ({
  cfg,
  fileData,
  allFiles,
  limit,
  sort
}) => {
  const sorter = sort ?? byDateAndAlphabeticalFolderFirst(cfg);
  let list = [...allFiles].sort(sorter);
  if (limit) {
    list = list.slice(0, limit);
  }
  const fileSlug = fileData?.slug;
  return /* @__PURE__ */ jsx("ul", { class: "section-ul", children: list.map((page) => {
    const title = page.frontmatter?.title;
    const tags = page.frontmatter?.tags ?? [];
    return /* @__PURE__ */ jsx("li", { class: "section-li", children: /* @__PURE__ */ jsxs("div", { class: "section", children: [
      /* @__PURE__ */ jsx("p", { class: "meta", children: page.dates && /* @__PURE__ */ jsx(
        DateDisplay,
        {
          date: getDate(cfg, page),
          locale: cfg?.locale ?? "en-US"
        }
      ) }),
      /* @__PURE__ */ jsx("div", { class: "desc", children: /* @__PURE__ */ jsx("h3", { children: /* @__PURE__ */ jsx(
        "a",
        {
          href: resolveRelative(fileSlug ?? "", page.slug),
          class: "internal",
          children: title
        }
      ) }) }),
      /* @__PURE__ */ jsx("ul", { class: "tags", children: tags.map((tag) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
        "a",
        {
          class: "internal tag-link",
          href: resolveRelative(
            fileSlug ?? "",
            `tags/${tag}`
          ),
          children: tag
        }
      ) })) })
    ] }) });
  }) });
};
PageList.css = `
.section h3 {
  margin: 0;
}

.section > .tags {
  margin: 0;
}
`;

// src/i18n/locales/en-US.ts
var en_US_default = {
  pages: {
    folderContent: {
      folder: "Folder",
      itemsUnderFolder: ({ count }) => count === 1 ? "1 item under this folder." : `${count} items under this folder.`
    }
  },
  components: {}
};

// src/i18n/index.ts
var locales = {
  "en-US": en_US_default
};
function i18n(locale) {
  return locales[locale] || en_US_default;
}

// src/components/styles/listPage.scss
var listPage_default = "ul.section-ul {\n  list-style: none;\n  margin-top: 2em;\n  padding-left: 0;\n}\n\nli.section-li {\n  margin-bottom: 1em;\n}\nli.section-li > .section {\n  display: grid;\n  grid-template-columns: fit-content(8em) 3fr 1fr;\n}\n@media all and (max-width: 600px) {\n  li.section-li > .section > .tags {\n    display: none;\n  }\n}\nli.section-li > .section > .desc > h3 > a {\n  background-color: transparent;\n}\nli.section-li > .section .meta {\n  margin: 0 1em 0 0;\n  opacity: 0.6;\n}\n\n.popover .section {\n  grid-template-columns: fit-content(8em) 1fr !important;\n}\n.popover .section > .tags {\n  display: none;\n}";
var defaultOptions = {
  showFolderCount: true,
  showSubfolders: true
};
function concatenateResources(...resources) {
  const result = resources.filter((r) => r !== void 0).flat();
  return result.length === 0 ? void 0 : result;
}
function pagesFromTrie(folder, showSubfolders) {
  return folder.children.map((node) => {
    const nodeData = node.data;
    if (nodeData) return nodeData;
    if (node.isFolder && showSubfolders) {
      return {
        slug: node.slug,
        dates: mostRecentDatesFromChildren(node.children),
        frontmatter: { title: node.displayName, tags: [] }
      };
    }
    return void 0;
  }).filter((page) => page !== void 0);
}
function pagesFromAllFiles(allFiles, folderSlug, showSubfolders) {
  const folderPrefix = folderSlug.endsWith("/index") ? folderSlug.slice(0, -"index".length) : folderSlug.endsWith("/") ? folderSlug : folderSlug + "/";
  const directChildren = [];
  const subfolderFiles = /* @__PURE__ */ new Map();
  for (const file of allFiles) {
    const fileSlug = file.slug;
    if (!fileSlug || !fileSlug.startsWith(folderPrefix)) continue;
    const relativePath = fileSlug.slice(folderPrefix.length);
    if (!relativePath || relativePath === "index") continue;
    const segments = relativePath.split("/");
    if (segments.length === 1) {
      directChildren.push(file);
    } else if (showSubfolders) {
      const subfolderName = segments[0];
      if (!subfolderFiles.has(subfolderName)) {
        subfolderFiles.set(subfolderName, []);
      }
      subfolderFiles.get(subfolderName).push(file);
    }
  }
  for (const [subfolderName, files] of subfolderFiles) {
    const indexFile = files.find((f) => f.slug === `${folderPrefix}${subfolderName}/index`);
    if (indexFile) continue;
    directChildren.push({
      slug: `${folderPrefix}${subfolderName}/index`,
      dates: mostRecentDatesFromEntries(files),
      frontmatter: { title: subfolderName, tags: [] }
    });
  }
  return directChildren;
}
function mostRecentDatesFromChildren(children) {
  let maybeDates;
  for (const child of children) {
    const childDates = child.data?.dates;
    if (childDates) {
      if (!maybeDates) {
        maybeDates = { ...childDates };
      } else {
        if (childDates.created > maybeDates.created) maybeDates.created = childDates.created;
        if (childDates.modified > maybeDates.modified) maybeDates.modified = childDates.modified;
        if (childDates.published > maybeDates.published)
          maybeDates.published = childDates.published;
      }
    }
  }
  return maybeDates ?? { created: /* @__PURE__ */ new Date(), modified: /* @__PURE__ */ new Date(), published: /* @__PURE__ */ new Date() };
}
function mostRecentDatesFromEntries(entries) {
  let maybeDates;
  for (const entry of entries) {
    if (entry.dates) {
      if (!maybeDates) {
        maybeDates = { ...entry.dates };
      } else {
        if (entry.dates.created > maybeDates.created) maybeDates.created = entry.dates.created;
        if (entry.dates.modified > maybeDates.modified) maybeDates.modified = entry.dates.modified;
        if (entry.dates.published > maybeDates.published)
          maybeDates.published = entry.dates.published;
      }
    }
  }
  return maybeDates ?? { created: /* @__PURE__ */ new Date(), modified: /* @__PURE__ */ new Date(), published: /* @__PURE__ */ new Date() };
}
var FolderContent_default = ((opts) => {
  const options = { ...defaultOptions, ...opts };
  const FolderContent = (props) => {
    const { tree, fileData, allFiles, cfg } = props;
    const ctx = props.ctx;
    const slug = fileData?.slug;
    if (!slug) return null;
    const trie = ctx?.trie;
    let allPagesInFolder;
    if (trie) {
      const folder = trie.findNode(slug.split("/"));
      if (!folder) return null;
      allPagesInFolder = pagesFromTrie(folder, options.showSubfolders);
    } else {
      allPagesInFolder = pagesFromAllFiles(allFiles ?? [], slug, options.showSubfolders);
    }
    const cssClasses = fileData?.frontmatter?.cssclasses ?? [];
    const classes = cssClasses.join(" ");
    const listProps = {
      ...props,
      sort: options.sort,
      allFiles: allPagesInFolder
    };
    const hastRoot = tree;
    const content = hastRoot.children.length === 0 ? fileData?.description : htmlToJsx(hastRoot);
    const pageListContent = PageList(listProps);
    return /* @__PURE__ */ jsxs("div", { class: "popover-hint", children: [
      /* @__PURE__ */ jsx("article", { class: classes, children: content }),
      /* @__PURE__ */ jsxs("div", { class: "page-listing", children: [
        options.showFolderCount && /* @__PURE__ */ jsx("p", { children: i18n(
          cfg?.locale ?? "en-US"
        ).pages.folderContent.itemsUnderFolder({
          count: allPagesInFolder.length
        }) }),
        /* @__PURE__ */ jsx("div", { children: pageListContent })
      ] })
    ] });
  };
  FolderContent.css = concatenateResources(listPage_default, PageList.css);
  return FolderContent;
});

export { FolderContent_default as FolderContent, PageList, byDateAndAlphabetical, byDateAndAlphabeticalFolderFirst };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map