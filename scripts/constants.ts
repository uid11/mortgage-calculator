import {join} from 'node:path';

/**
 * Relative (from root) path to HTML file with page template.
 */
export const BUILT_PAGE_PATH = join('docs', 'index.html');

/**
 * Relative (from root) path to HTML file with page template.
 */
export const PAGE_HTML_PATH = join('html', 'page.html');

/**
 * Relative (from root) path to CSS file with page styles.
 */
export const PAGE_STYLES_PATH = join('styles', 'page.css');

/**
 * Default options for `readFile`/`readFileSync` function from `node:fs`.
 */
export const READ_FILE_OPTIONS = {encoding: 'utf8'} as const;
