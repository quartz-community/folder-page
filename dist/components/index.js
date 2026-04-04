import { getDate } from '@quartz-community/utils/sort';
export { byDateAndAlphabetical } from '@quartz-community/utils/sort';
import { isFolderPath, resolveRelative } from '@quartz-community/utils/path';
import { jsx, jsxs } from 'preact/jsx-runtime';
import { htmlToJsx } from '@quartz-community/utils/jsx';

// src/components/PageList.tsx
function byDateAndAlphabeticalFolderFirst(_cfg) {
  return (f1, f2) => {
    const f1IsFolder = isFolderPath(f1.slug ?? "");
    const f2IsFolder = isFolderPath(f2.slug ?? "");
    if (f1IsFolder && !f2IsFolder) return -1;
    if (!f1IsFolder && f2IsFolder) return 1;
    if (f1.dates && f2.dates) {
      return (getDate(f2)?.getTime() ?? 0) - (getDate(f1)?.getTime() ?? 0);
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
  const sorter = sort ?? byDateAndAlphabeticalFolderFirst();
  let list = [...allFiles].sort(sorter);
  if (limit) {
    list = list.slice(0, limit);
  }
  const fileSlug = fileData?.slug;
  return /* @__PURE__ */ jsx("ul", { class: "section-ul", children: list.map((page) => {
    const title = page.frontmatter?.title;
    const tags = page.frontmatter?.tags ?? [];
    return /* @__PURE__ */ jsx("li", { class: "section-li", children: /* @__PURE__ */ jsxs("div", { class: "section", children: [
      /* @__PURE__ */ jsx("p", { class: "meta", children: page.dates && getDate(page) && /* @__PURE__ */ jsx(
        DateDisplay,
        {
          date: getDate(page),
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

// src/i18n/locales/ar-SA.ts
var ar_SA_default = {
  pages: {
    folderContent: {
      folder: "\u0645\u062C\u0644\u062F",
      itemsUnderFolder: ({ count }) => count === 1 ? "\u064A\u0648\u062C\u062F \u0639\u0646\u0635\u0631 \u0648\u0627\u062D\u062F \u0641\u0642\u0637 \u062A\u062D\u062A \u0647\u0630\u0627 \u0627\u0644\u0645\u062C\u0644\u062F" : `\u064A\u0648\u062C\u062F ${count} \u0639\u0646\u0627\u0635\u0631 \u062A\u062D\u062A \u0647\u0630\u0627 \u0627\u0644\u0645\u062C\u0644\u062F.`
    }
  },
  components: {}
};

// src/i18n/locales/ca-ES.ts
var ca_ES_default = {
  pages: {
    folderContent: {
      folder: "Carpeta",
      itemsUnderFolder: ({ count }) => count === 1 ? "1 article en aquesta carpeta." : `${count} articles en esta carpeta.`
    }
  },
  components: {}
};

// src/i18n/locales/cs-CZ.ts
var cs_CZ_default = {
  pages: {
    folderContent: {
      folder: "Slo\u017Eka",
      itemsUnderFolder: ({ count }) => count === 1 ? "1 polo\u017Eka v t\xE9to slo\u017Ece." : `${count} polo\u017Eek v t\xE9to slo\u017Ece.`
    }
  },
  components: {}
};

// src/i18n/locales/de-DE.ts
var de_DE_default = {
  pages: {
    folderContent: {
      folder: "Ordner",
      itemsUnderFolder: ({ count }) => count === 1 ? "1 Datei in diesem Ordner." : `${count} Dateien in diesem Ordner.`
    }
  },
  components: {}
};

// src/i18n/locales/en-GB.ts
var en_GB_default = {
  pages: {
    folderContent: {
      folder: "Folder",
      itemsUnderFolder: ({ count }) => count === 1 ? "1 item under this folder." : `${count} items under this folder.`
    }
  },
  components: {}
};

// src/i18n/locales/es-ES.ts
var es_ES_default = {
  pages: {
    folderContent: {
      folder: "Carpeta",
      itemsUnderFolder: ({ count }) => count === 1 ? "1 art\xEDculo en esta carpeta." : `${count} art\xEDculos en esta carpeta.`
    }
  },
  components: {}
};

// src/i18n/locales/fa-IR.ts
var fa_IR_default = {
  pages: {
    folderContent: {
      folder: "\u067E\u0648\u0634\u0647",
      itemsUnderFolder: ({ count }) => count === 1 ? ".\u06CC\u06A9 \u0645\u0637\u0644\u0628 \u062F\u0631 \u0627\u06CC\u0646 \u067E\u0648\u0634\u0647 \u0627\u0633\u062A" : `${count} \u0645\u0637\u0644\u0628 \u062F\u0631 \u0627\u06CC\u0646 \u067E\u0648\u0634\u0647 \u0627\u0633\u062A.`
    }
  },
  components: {}
};

// src/i18n/locales/fi-FI.ts
var fi_FI_default = {
  pages: {
    folderContent: {
      folder: "Kansio",
      itemsUnderFolder: ({ count }) => count === 1 ? "1 kohde t\xE4ss\xE4 kansiossa." : `${count} kohdetta t\xE4ss\xE4 kansiossa.`
    }
  },
  components: {}
};

// src/i18n/locales/fr-FR.ts
var fr_FR_default = {
  pages: {
    folderContent: {
      folder: "Dossier",
      itemsUnderFolder: ({ count }) => count === 1 ? "1 \xE9l\xE9ment sous ce dossier." : `${count} \xE9l\xE9ments sous ce dossier.`
    }
  },
  components: {}
};

// src/i18n/locales/he-IL.ts
var he_IL_default = {
  pages: {
    folderContent: {
      folder: "\u05EA\u05D9\u05E7\u05D9\u05D9\u05D4",
      itemsUnderFolder: ({ count }) => count === 1 ? "\u05E4\u05E8\u05D9\u05D8 \u05D0\u05D7\u05D3 \u05EA\u05D7\u05EA \u05EA\u05D9\u05E7\u05D9\u05D9\u05D4 \u05D6\u05D5." : `${count} \u05E4\u05E8\u05D9\u05D8\u05D9\u05DD \u05EA\u05D7\u05EA \u05EA\u05D9\u05E7\u05D9\u05D9\u05D4 \u05D6\u05D5.`
    }
  },
  components: {}
};

// src/i18n/locales/hu-HU.ts
var hu_HU_default = {
  pages: {
    folderContent: {
      folder: "Mappa",
      itemsUnderFolder: ({ count }) => `Ebben a mapp\xE1ban ${count} elem tal\xE1lhat\xF3.`
    }
  },
  components: {}
};

// src/i18n/locales/id-ID.ts
var id_ID_default = {
  pages: {
    folderContent: {
      folder: "Folder",
      itemsUnderFolder: ({ count }) => count === 1 ? "1 item di bawah folder ini." : `${count} item di bawah folder ini.`
    }
  },
  components: {}
};

// src/i18n/locales/it-IT.ts
var it_IT_default = {
  pages: {
    folderContent: {
      folder: "Cartella",
      itemsUnderFolder: ({ count }) => count === 1 ? "1 oggetto in questa cartella." : `${count} oggetti in questa cartella.`
    }
  },
  components: {}
};

// src/i18n/locales/ja-JP.ts
var ja_JP_default = {
  pages: {
    folderContent: {
      folder: "\u30D5\u30A9\u30EB\u30C0",
      itemsUnderFolder: ({ count }) => `${count}\u4EF6\u306E\u30DA\u30FC\u30B8`
    }
  },
  components: {}
};

// src/i18n/locales/kk-KZ.ts
var kk_KZ_default = {
  pages: {
    folderContent: {
      folder: "\u049A\u0430\u043B\u0442\u0430",
      itemsUnderFolder: ({ count }) => count === 1 ? "\u0411\u04B1\u043B \u049B\u0430\u043B\u0442\u0430\u0434\u0430 1 \u044D\u043B\u0435\u043C\u0435\u043D\u0442 \u0431\u0430\u0440." : `\u0411\u04B1\u043B \u049B\u0430\u043B\u0442\u0430\u0434\u0430 ${count} \u044D\u043B\u0435\u043C\u0435\u043D\u0442 \u0431\u0430\u0440.`
    }
  },
  components: {}
};

// src/i18n/locales/ko-KR.ts
var ko_KR_default = {
  pages: {
    folderContent: {
      folder: "\uD3F4\uB354",
      itemsUnderFolder: ({ count }) => `${count}\uAC74\uC758 \uD56D\uBAA9`
    }
  },
  components: {}
};

// src/i18n/locales/lt-LT.ts
var lt_LT_default = {
  pages: {
    folderContent: {
      folder: "Aplankas",
      itemsUnderFolder: ({ count }) => count === 1 ? "1 elementas \u0161iame aplanke." : count < 10 ? `${count} elementai \u0161iame aplanke.` : `${count} element\u0173 \u0161iame aplanke.`
    }
  },
  components: {}
};

// src/i18n/locales/nb-NO.ts
var nb_NO_default = {
  pages: {
    folderContent: {
      folder: "Mappe",
      itemsUnderFolder: ({ count }) => count === 1 ? "1 gjenstand i denne mappen." : `${count} gjenstander i denne mappen.`
    }
  },
  components: {}
};

// src/i18n/locales/nl-NL.ts
var nl_NL_default = {
  pages: {
    folderContent: {
      folder: "Map",
      itemsUnderFolder: ({ count }) => count === 1 ? "1 item in deze map." : `${count} items in deze map.`
    }
  },
  components: {}
};

// src/i18n/locales/pl-PL.ts
var pl_PL_default = {
  pages: {
    folderContent: {
      folder: "Folder",
      itemsUnderFolder: ({ count }) => count === 1 ? "W tym folderze jest 1 element." : `Element\xF3w w folderze: ${count}.`
    }
  },
  components: {}
};

// src/i18n/locales/pt-BR.ts
var pt_BR_default = {
  pages: {
    folderContent: {
      folder: "Arquivo",
      itemsUnderFolder: ({ count }) => count === 1 ? "1 item neste arquivo." : `${count} items neste arquivo.`
    }
  },
  components: {}
};

// src/i18n/locales/ro-RO.ts
var ro_RO_default = {
  pages: {
    folderContent: {
      folder: "Dosar",
      itemsUnderFolder: ({ count }) => count === 1 ? "1 articol \xEEn acest dosar." : `${count} elemente \xEEn acest dosar.`
    }
  },
  components: {}
};

// src/i18n/locales/ru-RU.ts
var ru_RU_default = {
  pages: {
    folderContent: {
      folder: "\u041F\u0430\u043F\u043A\u0430",
      itemsUnderFolder: ({ count }) => `\u0432 \u044D\u0442\u043E\u0439 \u043F\u0430\u043F\u043A\u0435 ${count} \u044D\u043B\u0435\u043C\u0435\u043D\u0442${getForm(count, "", "\u0430", "\u043E\u0432")}`
    }
  },
  components: {}
};
function getForm(number, form1, form2, form5) {
  const remainder100 = number % 100;
  const remainder10 = remainder100 % 10;
  if (remainder100 >= 10 && remainder100 <= 20) return form5;
  if (remainder10 > 1 && remainder10 < 5) return form2;
  if (remainder10 == 1) return form1;
  return form5;
}

// src/i18n/locales/th-TH.ts
var th_TH_default = {
  pages: {
    folderContent: {
      folder: "\u0E42\u0E1F\u0E25\u0E40\u0E14\u0E2D\u0E23\u0E4C",
      itemsUnderFolder: ({ count }) => `\u0E21\u0E35 ${count} \u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E43\u0E19\u0E42\u0E1F\u0E25\u0E40\u0E14\u0E2D\u0E23\u0E4C\u0E19\u0E35\u0E49`
    }
  },
  components: {}
};

// src/i18n/locales/tr-TR.ts
var tr_TR_default = {
  pages: {
    folderContent: {
      folder: "Klas\xF6r",
      itemsUnderFolder: ({ count }) => count === 1 ? "Bu klas\xF6r alt\u0131nda 1 \xF6\u011Fe." : `Bu klas\xF6r alt\u0131ndaki ${count} \xF6\u011Fe.`
    }
  },
  components: {}
};

// src/i18n/locales/uk-UA.ts
var uk_UA_default = {
  pages: {
    folderContent: {
      folder: "\u0422\u0435\u043A\u0430",
      itemsUnderFolder: ({ count }) => count === 1 ? "\u0423 \u0446\u0456\u0439 \u0442\u0435\u0446\u0456 1 \u0435\u043B\u0435\u043C\u0435\u043D\u0442." : `\u0415\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432 \u0443 \u0446\u0456\u0439 \u0442\u0435\u0446\u0456: ${count}.`
    }
  },
  components: {}
};

// src/i18n/locales/vi-VN.ts
var vi_VN_default = {
  pages: {
    folderContent: {
      folder: "Th\u01B0 m\u1EE5c",
      itemsUnderFolder: ({ count }) => `C\xF3 ${count} trang trong th\u01B0 m\u1EE5c n\xE0y.`
    }
  },
  components: {}
};

// src/i18n/locales/zh-CN.ts
var zh_CN_default = {
  pages: {
    folderContent: {
      folder: "\u6587\u4EF6\u5939",
      itemsUnderFolder: ({ count }) => `\u6B64\u6587\u4EF6\u5939\u4E0B\u6709${count}\u6761\u7B14\u8BB0\u3002`
    }
  },
  components: {}
};

// src/i18n/locales/zh-TW.ts
var zh_TW_default = {
  pages: {
    folderContent: {
      folder: "\u8CC7\u6599\u593E",
      itemsUnderFolder: ({ count }) => `\u6B64\u8CC7\u6599\u593E\u4E0B\u6709 ${count} \u689D\u7B46\u8A18\u3002`
    }
  },
  components: {}
};

// src/i18n/index.ts
var locales = {
  "en-US": en_US_default,
  "ar-SA": ar_SA_default,
  "ca-ES": ca_ES_default,
  "cs-CZ": cs_CZ_default,
  "de-DE": de_DE_default,
  "en-GB": en_GB_default,
  "es-ES": es_ES_default,
  "fa-IR": fa_IR_default,
  "fi-FI": fi_FI_default,
  "fr-FR": fr_FR_default,
  "he-IL": he_IL_default,
  "hu-HU": hu_HU_default,
  "id-ID": id_ID_default,
  "it-IT": it_IT_default,
  "ja-JP": ja_JP_default,
  "kk-KZ": kk_KZ_default,
  "ko-KR": ko_KR_default,
  "lt-LT": lt_LT_default,
  "nb-NO": nb_NO_default,
  "nl-NL": nl_NL_default,
  "pl-PL": pl_PL_default,
  "pt-BR": pt_BR_default,
  "ro-RO": ro_RO_default,
  "ru-RU": ru_RU_default,
  "th-TH": th_TH_default,
  "tr-TR": tr_TR_default,
  "uk-UA": uk_UA_default,
  "vi-VN": vi_VN_default,
  "zh-CN": zh_CN_default,
  "zh-TW": zh_TW_default
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

export { FolderContent_default as FolderContent, PageList, byDateAndAlphabeticalFolderFirst };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map