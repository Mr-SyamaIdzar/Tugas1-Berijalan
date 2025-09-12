import { Request, Response, NextFunction } from "express";
import * as AuthService from "../services/auth.service";

export const createAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await AuthService.createAdmin(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await AuthService.updateAdmin(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await AuthService.deleteAdmin(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
