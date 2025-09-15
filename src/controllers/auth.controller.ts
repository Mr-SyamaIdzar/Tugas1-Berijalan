import { Request, Response, NextFunction } from "express";
import * as AuthService from "../services/auth.service";

export const CLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password } = req.body;
    const result = await AuthService.SLogin(username, password);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CCreateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await AuthService.SCreateAdmin(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const CUpdateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await AuthService.SUpdateAdmin(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CDeleteAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await AuthService.SDeleteAdmin(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CGetAllAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await AuthService.SGetAllAdmins();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};