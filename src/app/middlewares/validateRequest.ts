/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, RequestHandler, Response } from "express";
import { z } from "zod";
import catchAsync from "../utils/catchAsync";

const validateRequest = (
  schema: z.ZodObject<{
    body?: z.ZodTypeAny;
    query?: z.ZodTypeAny;
    params?: z.ZodTypeAny;
  }>,
  strictCheck = true
): RequestHandler => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const shape = schema.shape;

    if (shape.body) {
      const bodySchema =
        strictCheck && shape.body instanceof z.ZodObject
          ? shape.body.strict()
          : shape.body;
      await bodySchema.parseAsync(req.body);
    }

    if (shape.params) {
      const paramsSchema =
        strictCheck && shape.params instanceof z.ZodObject
          ? shape.params.strict()
          : shape.params;
      await paramsSchema.parseAsync(req.params);
    }

    if (shape.query) {
      const querySchema =
        strictCheck && shape.query instanceof z.ZodObject
          ? shape.query.strict()
          : shape.query;
      await querySchema.parseAsync(req.query);
    }

    next();
  });
};

export default validateRequest;





