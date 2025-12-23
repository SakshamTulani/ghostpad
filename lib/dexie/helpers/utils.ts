/**
 * Generates a unique ID using crypto.randomUUID().
 * @returns A unique string ID.
 */
export const generateId = (): string => {
  return crypto.randomUUID();
};

/**
 * Returns the current time and date in milliseconds.
 * @returns Current timestamp in milliseconds.
 */
export const now = (): number => {
  return Date.now();
};
