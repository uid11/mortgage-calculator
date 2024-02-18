import {readFileSync} from 'node:fs';

import {PAGE_HTML_PATH, READ_FILE_OPTIONS} from './constants.js';

/**
 * Get template HTML content of page.
 */
export const getHtmlContent = (): string => readFileSync(PAGE_HTML_PATH, READ_FILE_OPTIONS);
