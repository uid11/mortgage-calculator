/**
 * Logs successful message.
 */
export const logSuccessfulMessage = (message: string): void =>
  console.log(`\x1B[32m[OK]\x1B[39m ${message}`);
