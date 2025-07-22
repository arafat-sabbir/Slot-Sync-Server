import { ZodError } from "zod";
import { TGenericErrorResponse } from "../interface/error";

/**
 * Handles Zod validation errors and returns a simplified error object.
 *
 * @param {ZodError} err - The Zod error object.
 * @returns {Object} - The simplified error object containing status code, message, and error sources.
 */
const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const statusCode = 400;
  const errorSources = err.issues.map((issue) => ({
    path: issue.path[issue.path.length - 1],
    message: issue.message,
  }));
  const errorMessage = err.issues.map((issue) => issue.message).join(", ");

  return {
    success: false,
    statusCode,
    message: errorMessage,
    errorSources,
  };
};

export default handleZodError;
