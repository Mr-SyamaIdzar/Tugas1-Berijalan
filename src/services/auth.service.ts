import { hashPassword } from "../utils/password.util";
import {
  IGlobalResponse,
  ILoginResponse,
  IAdminResponse,
} from "../interfaces/global.interface";
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

export const SCreateAdmin = async (
  payload: any
): Promise<IGlobalResponse<IAdminResponse>> => {
  const existing = await prisma.admin.findFirst({
    where: {
      OR: [{ username: payload.username }, { email: payload.email }],
    },
  });

  if (existing) throw new Error("Username or email already used");

  const passwordHash = await hashPassword(payload.password);

  const admin = await prisma.admin.create({
    data: {
      username: payload.username,
      email: payload.email,
      password: passwordHash,
      name: payload.name,
    },
  });

  return {
    status: true,
    message: "Admin created successfully",
    data: {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      name: admin.name,
      isActive: admin.isActive,
      createdAt: admin.createdAt,
      updateAt: admin.updateAt,
    },
  };
};

// UPDATE ADMIN (DIUBAH)
export const SUpdateAdmin = async (
  id: number,
  payload: any
): Promise<IGlobalResponse<IAdminResponse>> => {
  const data: any = { ...payload };

  if (payload.password) {
    data.password = await hashPassword(payload.password);
  }

  const admin = await prisma.admin.update({
    where: { id },
    data,
  });

  return {
    status: true,
    message: "Admin updated successfully",
    data: {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      name: admin.name,
      isActive: admin.isActive,
      createdAt: admin.createdAt,
      updateAt: admin.updateAt,
    },
  };
};

export const SDeleteAdmin = async (
  id: number
): Promise<IGlobalResponse<null>> => {
  await prisma.admin.delete({
    where: { id },
  });

  return {
    status: true,
    message: "Admin deleted successfully",
    data: null,
  };
};

// GET ALL ADMINS (TIDAK DIUBAH)
export const SGetAllAdmins = async (): Promise<IGlobalResponse> => {
  const admins = await prisma.admin.findMany({
    where: {
      deletedAt: null,
    },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      isActive: true,
      createdAt: true,
      updateAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    status: true,
    message: "Admins retrieved successfully",
    data: admins,
  };
};
