import {writeFileSync} from 'node:fs';

import {BUILT_PAGE_PATH} from './constants.js';

/**
 * Writes build page as GitHub Pages static content.
 */
export const writeBuiltPage = (builtPageContent: string): void =>
  writeFileSync(BUILT_PAGE_PATH, builtPageContent);
