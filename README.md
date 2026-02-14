# @quartz-community/folder-page

Renders folder index pages showing a listing of all pages within that folder. Automatically generates virtual index pages for folders that don't have one.

## Installation

```bash
npx quartz plugin add github:quartz-community/folder-page
```

## Usage

```ts
// quartz.config.ts
import * as ExternalPlugin from "./.quartz/plugins";

const config: QuartzConfig = {
  plugins: {
    pageTypes: [ExternalPlugin.FolderPage()],
  },
};
```

```ts
// quartz.layout.ts
export const layout = {
  byPageType: {
    folder: {
      beforeBody: [...],
      left: [...],
      right: [...],
    },
  },
}
```

## Configuration

| Option            | Type      | Default     | Description                                        |
| ----------------- | --------- | ----------- | -------------------------------------------------- |
| `showFolderCount` | `boolean` | `undefined` | Whether to show the number of items in the folder. |
| `showSubfolders`  | `boolean` | `undefined` | Whether to show subfolders in the listing.         |
| `sort`            | `SortFn`  | `undefined` | A function to sort the pages in the folder.        |

## Documentation

See the [Quartz documentation](https://quartz.jzhao.xyz/) for more information.

## License

MIT
