import { QuartzComponent } from '@quartz-community/types';
import { S as SortFn } from '../PageList-DncPcZ4-.js';
export { P as PageList, b as byDateAndAlphabetical, a as byDateAndAlphabeticalFolderFirst } from '../PageList-DncPcZ4-.js';

interface FolderContentOptions {
    showFolderCount: boolean;
    showSubfolders: boolean;
    sort?: SortFn;
}
declare const _default: (opts?: Partial<FolderContentOptions>) => QuartzComponent;

export { _default as FolderContent, SortFn };
