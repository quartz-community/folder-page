# Changelog

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
