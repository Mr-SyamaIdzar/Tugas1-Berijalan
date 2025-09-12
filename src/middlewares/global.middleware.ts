import { Request, Response, NextFunction, RequestHandler } from "express";
import { ObjectSchema } from "joi";

// Middleware untuk validasi body
export const validateBody = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        status: false,
        message: "Validation error",
        error: error.details.map((err) => ({
          message: err.message,
          field: err.path.join(". "),
        })),
      });
    }

    next();
  };
};

// Middleware untuk validasi params
export const validateParams = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.params, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        status: false,
        message: "Validation error",
        error: error.details.map((err) => ({
          message: err.message,
          field: err.path.join(". "),
        })),
      });
    }

    next();
  };
};

// Middleware untuk validasi query
export const validateQuery = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.query, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        status: false,
        message: "Validation error",
        error: error.details.map((err) => ({
          message: err.message,
          field: err.path.join(". "),
        })),
      });
    }

    next();
  };
};
