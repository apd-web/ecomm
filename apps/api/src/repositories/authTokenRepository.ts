import { AuthToken } from "../models/AuthToken";

export const authTokenRepository = {
  create: (data: {
    user: string;
    tokenHash: string;
    type: "verify_email" | "reset_password";
    expiresAt: Date;
  }) => AuthToken.create(data),
  findActive: (tokenHash: string, type: "verify_email" | "reset_password") =>
    AuthToken.findOne({ tokenHash, type, usedAt: { $exists: false } }).exec(),
  markUsed: (id: string) => AuthToken.findByIdAndUpdate(id, { usedAt: new Date() }).exec(),
  revokeExisting: (userId: string, type: "verify_email" | "reset_password") =>
    AuthToken.updateMany(
      { user: userId, type, usedAt: { $exists: false } },
      { usedAt: new Date() },
    ),
};
