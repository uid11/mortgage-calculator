/**
 * Adds `DOMContentLoaded` handler on page.
 * If the page is already loaded, then call the handler immediately.
 * This client function should not use scope variables (except other client functions).
 */
export function addDomContentLoadedHandler(handler: () => void): void {
  if (document.readyState !== 'loading') {
    handler();

    return;
  }

  document.addEventListener('DOMContentLoaded', handler);
}
