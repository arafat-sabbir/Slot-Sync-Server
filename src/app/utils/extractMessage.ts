/**
 * Extract meaningful error message from Prisma validation error.
 * @param {string} fullMessage - Full error message from Prisma.
 * @returns {string} Simplified error message.
 */

const extractMeaningfulMessage = (fullMessage: string): string => {
  const match = fullMessage.match(/Argument `(.+?)` is missing/);
  return match ? `The '${match[1]}' field is required.` : "Invalid input.";
};

export default extractMeaningfulMessage;
