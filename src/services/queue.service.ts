import { PrismaClient } from "@prisma/client";
import { IGlobalResponse } from "../interfaces/global.interface";

const prismaClient = new PrismaClient();

export const SClaimQueue = async (): Promise<IGlobalResponse> => {
  try {
    const counter = await prismaClient.counter.findFirst({
      where: {
        isActive: true,
        deletedAt: null,
      },
      orderBy: { createdAt: "asc" },
    });

    if (!counter) {
      throw Error("No active counter found!");
    }

    let nextQueueNum = counter.currentQueue + 1;

    const queue = await prismaClient.queue.create({
      data: {
        status: "claimed",
        number: nextQueueNum,
        counterId: counter.id,
      },
      include: {
        counter: true,
      },
    });

    await prismaClient.counter.update({
      where: { id: counter.id },
      data: { currentQueue: { increment: 1 } },
    });

    return {
      status: true,
      message: "Success claim queue!",
      data: queue,
    };
  } catch (error) {
    throw error;
  }
};

export const SReleaseQueue = async (): Promise<IGlobalResponse> => {
  try {
    const queue = await prismaClient.queue.findFirst({
      where: { status: "claimed" },
      orderBy: { createdAt: "desc" },
    });

    if (!queue) throw Error("No claimed queue to release!");

    await prismaClient.queue.update({
      where: { id: queue.id },
      data: { status: "released" },
    });

    return {
      status: true,
      message: `Queue ${queue.number} released successfully!`,
      data: queue,
    };
  } catch (error) {
    throw error;
  }
};

export const SCurentQueue = async (): Promise<IGlobalResponse> => {
  try {
    const counters = await prismaClient.counter.findMany({
      where: { isActive: true, deletedAt: null },
      include: {
        queues: {
          where: { status: { in: ["claimed", "called"] } },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return {
      status: true,
      message: "Current active counters!",
      data: counters,
    };
  } catch (error) {
    throw error;
  }
};

export const SNextQueue = async (
  counterId: number
): Promise<IGlobalResponse> => {
  try {
    const counter = await prismaClient.counter.findUnique({
      where: { id: counterId, isActive: true, deletedAt: null },
    });

    if (!counter) throw Error("No active counter found!");

    const claimedQueue = await prismaClient.queue.findFirst({
      where: {
        counterId: counter.id,
        status: "claimed",
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!claimedQueue) throw Error("No claimed queue found!");

    await prismaClient.queue.update({
      where: { id: claimedQueue.id },
      data: { status: "called" },
    });

    return {
      status: true,
      message: "Success get next queue!",
      data: { ...claimedQueue },
    };
  } catch (error) {
    throw error;
  }
};

export const SSkipQueue = async (
  counterId: number
): Promise<IGlobalResponse> => {
  try {
    const counter = await prismaClient.counter.findUnique({
      where: {
        id: counterId,
        isActive: true,
        deletedAt: null,
      },
    });

    if (!counter) throw Error("No active counter found!");

    const calledQueue = await prismaClient.queue.findFirst({
      where: { counterId, status: "called" },
      orderBy: { createdAt: "asc" },
    });

    if (!calledQueue) throw Error("No queue to skip!");

    await prismaClient.queue.update({
      where: { id: calledQueue.id },
      data: { status: "skipped" },
    });

    const nextQueue = await prismaClient.queue.findFirst({
      where: { counterId, status: "claimed" },
      orderBy: { createdAt: "asc" },
    });

    let nextDetail = null;
    if (nextQueue) {
      await prismaClient.queue.update({
        where: { id: nextQueue.id },
        data: { status: "called" },
      });
      nextDetail = nextQueue;
    }

    return {
      status: true,
      message: "Queue skipped! Next queue called (if available).",
      data: nextDetail,
    };
  } catch (error) {
    throw error;
  }
};

export const SResetQueue = async (
  counterId?: number
): Promise<IGlobalResponse> => {
  try {
    if (counterId) {
      await prismaClient.queue.updateMany({
        where: {
          counterId,
          status: { in: ["claimed", "called", "skipped"] },
        },
        data: { status: "released" },
      });

      await prismaClient.counter.update({
        where: { id: counterId },
        data: { currentQueue: 0 },
      });
    } else {
      await prismaClient.queue.updateMany({
        where: {
          counterId,
          status: { in: ["claimed", "called", "skipped"] },
        },
        data: { status: "released" },
      });

      await prismaClient.counter.updateMany({
        where: { isActive: true },
        data: { currentQueue: 0 },
      });
    }

    return {
      status: true,
      message: "Queue system reset successfully!",
    };
  } catch (error) {
    throw error;
  }
};
