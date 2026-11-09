---
"@quartz-community/folder-page": patch
---

Notes stored under a subfolder of `tags/` (`tags/plugin/b.md`) no longer get folder pages like `tags/plugin/index`, which sat next to tag-page's `tags/plugin`. `tags/` belongs to tag-page; virtual tag pages were already skipped.
