import * as clientFunctions from '../src/client/index.js';

/**
 * Get content of `<script>` tag.
 */
export const getScriptContent = (): string => {
  const parts: string[] = [];

  for (const fn of Object.values(clientFunctions)) {
    parts.push(fn.toString());
  }

  parts.push('init();');

  return parts.join('\n');
};
