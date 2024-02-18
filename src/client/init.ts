import {addDomContentLoadedHandler} from './addDomContentLoadedHandler.js';
import {onDomContentLoad} from './onDomContentLoad.js';

/**
 * Initialization function.
 * Executed once when processing the `<script>` tag (when the page is loaded).
 * This client function should not use scope variables (except other client functions).
 */
export function init(): void {
  addDomContentLoadedHandler(onDomContentLoad);
}
