/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, RequestHandler, Response } from "express";
import { z } from "zod";
import catchAsync from "../utils/catchAsync";

const validateRequest = (
  schema: z.ZodObject<any>,
  strictCheck = true
): RequestHandler => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Validate each part of the request separately
    if (schema.shape.body) {
      const bodySchema = strictCheck
        ? schema.shape.body.strict()
        : schema.shape.body;
      await bodySchema.parseAsync(req.body); // Directly validate req.body
    }

    if (schema.shape.params) {
      const paramsSchema = strictCheck
        ? schema.shape.params.strict()
        : schema.shape.params;
      await paramsSchema.parseAsync(req.params); // Directly validate req.params
    }

    if (schema.shape.query) {
      const querySchema = strictCheck
        ? schema.shape.query.strict()
        : schema.shape.query;
      await querySchema.parseAsync(req.query); // Directly validate req.query
    }

    // Continue to the next middleware
    next();
  });
};

export default validateRequest;
