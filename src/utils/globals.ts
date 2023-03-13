/**
 * Create a delay in ms
 * @param ms time of delay
 */
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
