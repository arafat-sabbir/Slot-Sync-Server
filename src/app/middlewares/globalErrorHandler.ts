/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import config from "../config";
import { TErrorSources, TGenericErrorResponse } from "../interface/error";
import handleZodError from "../errors/handleZodError";
import AppError from "../errors/appError";

/**
 * Global error handler for Express.js applications using Prisma.
 * Handles errors that occur during the request-response cycle.
 *
 * @param {Error} error - The error object.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 * @return {Response} The JSON response containing the error message and status code.
 */
const globalErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res: Response<TGenericErrorResponse>,
  next
) => {
  let statusCode = 500;
  let stack = null;
  let message = "Something Went Wrong";
  let errorSources: TErrorSources = [
    {
      path: " ",
      message: "Something Went Wrong",
    },
  ];

  if (error instanceof ZodError) {
    console.log("error", error);
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message as any;
    errorSources =
      config.node_env === "development"
        ? simplifiedError?.errorSources
        : ([] as any);
    stack = config.node_env === "development" && error.stack;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle known Prisma errors like unique constraint violations
    if (error.code === "P2002") {
      statusCode = 400;
      message = "Unique constraint failed";
      errorSources =
        config.node_env === "development"
          ? [
              {
                path: error.meta?.target
                  ? error.meta.target.toString()
                  : "unknown",
                message: "A record with this value already exists.",
              },
            ]
          : [];
    }
    // Handle record not found scenario
    if (error.code === "P2025") {
      statusCode = 404;
      message = error?.message;
      errorSources =
        config.node_env === "development"
          ? [
              {
                path: " ",
                message: error?.message,
              },
            ]
          : [];
    }
    stack = config.node_env === "development" && error.stack;
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = extractMeaningfulMessage(error.message);
    errorSources =
      config.node_env === "development"
        ? [
            {
              path: " ",
              message: extractMeaningfulMessage(error.message),
            },
          ]
        : [];
    stack = config.node_env === "development" && error.stack;
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = 500;
    message = "Unknown Database Error";
    errorSources =
      config.node_env === "development"
        ? [
            {
              path: " ",
              message: error.message,
            },
          ]
        : [];
    stack = config.node_env === "development" && error.stack;
  } else if (error instanceof AppError) {
    statusCode = error?.statusCode;
    message = error?.message;
    errorSources =
      config.node_env === "development"
        ? [
            {
              path: " ",
              message: error.message,
            },
          ]
        : [];
    stack = config.node_env === "development" && error.stack;
  } else if (error instanceof Error) {
    message = error?.message;
    errorSources =
      config.node_env === "development"
        ? [
            {
              path: " ",
              message: error.message,
            },
          ]
        : [];
    stack = config.node_env === "development" && error.stack;
  }

  res.status(statusCode).json({
    statusCode,
    success: false,
    message,
    ...(errorSources?.length ? { errorSources } : {}),
    ...(stack ? { stack } : {}),
  });
};

export default globalErrorHandler;

/**
 * Extract meaningful error message from Prisma validation error.
 * @param {string} fullMessage - Full error message from Prisma.
 * @returns {string} Simplified error message.
 */
const extractMeaningfulMessage = (fullMessage: string): string => {
  const match = fullMessage.match(/Argument `(.+?)` is missing/);
  return match ? `The '${match[1]}' field is required.` : "Invalid input.";
};
