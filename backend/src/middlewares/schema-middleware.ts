import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

export class SchemaMiddleware {
  public validate = (schema: ZodSchema) =>
    (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse(req);
        return next();
      } catch (error) {
        return res.status(400).json({
          code: 400,
          status: "error",
          message: "Invalid request data",
          error,
        });
      }
    };
}