import {getCspHash} from './getCspHash.js';
import {getHtmlContent} from './getHtmlContent.js';
import {getMetaCspTag} from './getMetaCspTag.js';
import {getScriptContent} from './getScriptContent.js';
import {getStyleContent} from './getStyleContent.js';

/**
 * Get HTML content of built page.
 */
export const getBuiltPageContent = (): string => {
  const htmlTemplate = getHtmlContent();

  const headIndex = htmlTemplate.indexOf('</head>');

  const beforeGeneratedContent = htmlTemplate.slice(0, headIndex);
  const afterGeneratedContent = htmlTemplate.slice(headIndex);

  const scriptContent = getScriptContent();
  const styleContent = getStyleContent();

  const scriptHash = getCspHash(scriptContent);
  const styleHash = getCspHash(styleContent);

  const metaCspTag = getMetaCspTag({scriptHash, styleHash});

  const scriptTag = `<script async type="module">${scriptContent}</script>`;
  const styleTag = `<style>${styleContent}</style>`;

  return [beforeGeneratedContent, metaCspTag, styleTag, scriptTag, afterGeneratedContent].join('');
};
