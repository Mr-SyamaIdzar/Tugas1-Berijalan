import { NextFunction, Request, Response } from "express";
import { IGlobalResponse } from "../interfaces/global.interface";
import { HttpError } from "../utils/http-error";
import { stat } from "fs";

export const MErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error:", err);

  const isDevelopment = process.env.NODE_ENV === "development";

  let statusCode = 500;
  let message = "Interval server error";

  if (err instanceof HttpError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 400;
    message = err.message;
  }

  if (err instanceof Error) {
    const response: IGlobalResponse = {
      status: false,
      message: err.message,
      error: {
        message: err.message,
        name: err.name,
        ...(isDevelopment && err.stack ? { detail: err.stack } : {}),
      },
    };

    const errorObj: any = { message: err.message };

    if (err.name) {
      errorObj.name = err.name;
    }

    if (isDevelopment && err.stack) {
      errorObj.detail = err.stack;
    }

    response.error = errorObj;

    res.status(400).json(response);
  } else {
    const response: IGlobalResponse = {
      status: false,
      message: "An unexpected error occured",
      error: {
        message: "Internal serve error",
      },
    };

    res.status(500).json(response);
  }
};
