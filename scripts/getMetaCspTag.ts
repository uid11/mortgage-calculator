type Options = Readonly<{scriptHash: string; styleHash: string}>;

/**
 * Get `<meta>` tag with CSP settings.
 */
export const getMetaCspTag = ({scriptHash, styleHash}: Options): string => `<meta
 http-equiv="Content-Security-Policy"
 content="default-src 'self'; img-src 'self' data:; script-src '${scriptHash}'; style-src '${styleHash}';"
/>`;
