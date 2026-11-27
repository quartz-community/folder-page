# Changelog

## 1.1.4

### Patch Changes

- b03b301: Generated folder pages are titled after their own folder as written in the vault, also when the folder holds pages with a permalink.
- b03b301: Subfolders without an index note show the date of their newest page again, and are ordered by it.
- b03b301: A subfolder whose index note is unlisted is no longer listed on its parent folder's page.

## 1.1.3

### Patch Changes

- 0ca8ee5: Bundles utils 1.3.1: `slugs.stripDiacritics` now strips accents from Latin letters only and writes ł, ø, ß, æ … in ASCII; other scripts are left as written.

## 1.1.2

### Patch Changes

- 67850da: Bundles `@quartz-community/utils` 1.3, so `configuration.slugs.stripDiacritics` (Quartz 5.3) also applies to the pages listed on folder pages. Before, the plugin bundled an older utils that ignored the option, and its slugs kept their diacritics.

## 1.1.1

### Patch Changes

- e9b5c61: Page list entries are `h2` headings under the page's `h1`; they were `h3`, which skipped a level for screen readers. They keep the `h3` size, so lists look the same. Dates are at 80% opacity instead of 60%, the lowest that keeps 4.5:1 contrast (WCAG AA) in light and dark mode.

## 1.1.0

### Minor Changes

- f16ea35: Requires Quartz 5.1 (`quartz.quartzVersion: ">=5.1.0"`): it lists `.base` and `.canvas` pages through `ctx.virtualPages`. On an older Quartz the build warns, and fails in CI; update Quartz with `npx quartz upgrade`.

## 1.0.4

### Patch Changes

- cda79ad: The manifest declares the `prefixFolders` option (default `false`), so option checks and Quartz Syncer know it.

## 1.0.3

### Patch Changes

- 0b57304: Uses Quartz's own `preact` instead of bundling a second copy (`noExternal` in the build overrode the externals). Components now share one Preact instance with Quartz and other plugins, so hooks and context work across them, and the bundle is smaller.

## 1.0.2

### Patch Changes

- bdb1aaa: Generate folder pages for folders that hold only virtual pages, such as `.base` or `.canvas` files rendered by bases-page / canvas-page, so going up a level no longer gives a 404 (jackyzha0/quartz#2576). Folder listings now also list a subfolder that has its own index page, and fall back to all pages when the folder is not in Quartz's folder hierarchy.
- 398001e: Bundles `@quartz-community/utils` 1.1.0: a short wikilink to an Obsidian folder note (`[[Topic]]` for `Topic/Topic.md`) reaches the folder page, and anchors to headings use the same slug as heading ids. `github-slugger` is no longer a dependency of this plugin.

## 1.0.1

### Patch Changes

- e7de665: A note with a frontmatter `permalink` (published at its permalink, Quartz 5.1+) stays in its folder in the folder listings, as in Obsidian Publish: pages are placed by their file path and linked by their address.

## 1.0.0

### Major Changes

- Stable 1.0 release. All `@quartz-community/*` dependencies now use `^1.0.0` ranges.

  Pre-1.0 caret ranges pinned the minor version (`^0.2.1` means `>=0.2.1 <0.3.0`), so
  published fixes to shared packages could never be resolved by dependents. Moving the
  ecosystem to 1.0 makes caret ranges behave conventionally.

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Respect the `file.data.unlisted` convention in both folder discovery (virtual page generation) and folder listings (the page-list inside a folder index). Unlisted pages are never shown in folder listings and never contribute folder/subfolder entries.
- Exported `pagesFromAllFiles` helper for reuse and testing.
- Unit tests for `pagesFromAllFiles` covering the unlisted-filter behavior.

- Initial Quartz community plugin template.
