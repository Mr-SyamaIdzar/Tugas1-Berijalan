// import prisma from "../libs/prisma";
import { hashPassword } from "../utils/password.util";
import { IGlobalResponse } from "../interfaces/global.interface";
import { ILoginResponse } from "../interfaces/global.interface";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { UGenerateToken } from "../utils/jwt";

const prisma = new PrismaClient();

export const SLogin = async (
  usernameOrEmail: string,
  password: string
): Promise<IGlobalResponse<ILoginResponse>> => {
  const admin = await prisma.admin.findFirst({
    where: {
      OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      isActive: true,
      deletedAt: null,
    },
  });

  if (!admin) {
    throw Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, admin.password);

  if (!isPasswordValid) {
    throw Error("Invalid credentials");
  }

  const token = UGenerateToken({
    id: admin.id,
    username: admin.username,
    email: admin.email,
    name: admin.name,
  });

  return {
    status: true,
    message: "Login successful",
    data: {
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
      },
    },
  };
};

type CreatePayload = {
  username: string;
  password: string;
  email: string;
  name: string;
};
type UpdatePayload = Partial<CreatePayload>;

export const createAdmin = async (
  payload: CreatePayload
): Promise<IGlobalResponse<any>> => {
  const existing = await prisma.admin.findFirst({
    where: {
      OR: [{ username: payload.username }, { email: payload.email }],
    },
  });

  if (existing) throw new Error("Username or email alredy used");

  const passwordHash = await hashPassword(payload.password);

  const admin = await prisma.admin.create({
    data: {
      username: payload.username,
      email: payload.email,
      password: passwordHash,
      name: payload.name,
    },
    select: { id: true, username: true, email: true, name: true },
  });

  return {
    status: true,
    message: "Admin created",
    data: admin,
  };
};

export const updateAdmin = async (
  id: number,
  payload: UpdatePayload
): Promise<IGlobalResponse<any>> => {
  const data: any = { ...payload };

  if (payload.password) {
    data.password = await hashPassword(payload.password);
  }

  const admin = await prisma.admin.update({
    where: { id },
    data,
    select: { id: true, username: true, email: true, name: true },
  });

  return {
    status: true,
    message: "Admin updated",
    data: admin,
  };
};

export const deleteAdmin = async (
  id: number
): Promise<IGlobalResponse<null>> => {
  await prisma.admin.delete({
    where: { id },
  });

  return {
    status: true,
    message: "Admin deleted",
  };
};
