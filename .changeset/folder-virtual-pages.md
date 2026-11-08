---
"@quartz-community/folder-page": patch
---

Generate folder pages for folders that hold only virtual pages, such as `.base` or `.canvas` files rendered by bases-page / canvas-page, so going up a level no longer gives a 404 (jackyzha0/quartz#2576). Folder listings now also list a subfolder that has its own index page, and fall back to all pages when the folder is not in Quartz's folder hierarchy.
