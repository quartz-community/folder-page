import { QuartzPageTypePlugin } from '@quartz-community/types';
import { S as SortFn } from './PageList-DncPcZ4-.js';

interface FolderPageOptions {
    showFolderCount?: boolean;
    showSubfolders?: boolean;
    sort?: SortFn;
}
declare const FolderPage: QuartzPageTypePlugin<FolderPageOptions>;

export { FolderPage as F, type FolderPageOptions as a };
