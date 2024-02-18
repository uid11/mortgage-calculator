import {readFileSync} from 'node:fs';

import {PAGE_STYLES_PATH, READ_FILE_OPTIONS} from './constants.js';

/**
 * Get content of `<style>` tag.
 */
export const getStyleContent = (): string => readFileSync(PAGE_STYLES_PATH, READ_FILE_OPTIONS);
