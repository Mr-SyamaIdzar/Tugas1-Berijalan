import jwt from "jsonwebtoken";

export const UGenerateToken = (payload: object) => {
  return jwt.sign(payload, process.env.JWT_SECRET || "secret", {
    expiresIn: "1d",
  });
};
