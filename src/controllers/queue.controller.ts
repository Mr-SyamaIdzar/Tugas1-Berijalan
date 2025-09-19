import { Request, Response, NextFunction } from "express";
import {
  SClaimQueue,
  SReleaseQueue,
  SCurentQueue,
  SNextQueue,
  SSkipQueue,
  SResetQueue,
} from "../services/queue.service";

export const CClaimedQueue = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await SClaimQueue();

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CReleaseQueue = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await SReleaseQueue();

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CCurrentQueue = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await SCurentQueue();

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CNextQueue = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await SNextQueue(Number(req.params.counter_id));

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CSkipQueue = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await SSkipQueue(Number(req.params.counter_id));

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const CResetQueue = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const counterId = req.body.queue_id
      ? Number(req.params.counter_id)
      : undefined;
    const result = await SResetQueue(counterId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
