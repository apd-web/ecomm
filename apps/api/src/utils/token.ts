import crypto from "node:crypto";

export const generateToken = (size = 48) => {
  return crypto.randomBytes(size).toString("hex");
};
