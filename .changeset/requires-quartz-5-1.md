---
"@quartz-community/folder-page": minor
---

Requires Quartz 5.1 (`quartz.quartzVersion: ">=5.1.0"`): it lists `.base` and `.canvas` pages through `ctx.virtualPages`. On an older Quartz the build warns, and fails in CI; update Quartz with `npx quartz upgrade`.
