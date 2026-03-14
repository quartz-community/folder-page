import { QuartzComponent } from '@quartz-community/types';

interface PageData {
    slug?: string;
    frontmatter?: {
        title?: string;
        tags?: string[];
    };
    dates?: {
        created: Date;
        modified: Date;
        published: Date;
    };
    [key: string]: unknown;
}
type SortFn = (f1: PageData, f2: PageData) => number;
declare function byDateAndAlphabetical(cfg: unknown): SortFn;
declare function byDateAndAlphabeticalFolderFirst(cfg: unknown): SortFn;
declare const PageList: QuartzComponent;

export { PageList as P, type SortFn as S, byDateAndAlphabeticalFolderFirst as a, byDateAndAlphabetical as b };
