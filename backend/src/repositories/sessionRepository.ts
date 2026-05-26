import { Session } from "../models/Session";

export const sessionRepository = {
  create: (data: {
    user: string;
    tokenHash: string;
    userAgent?: string;
    ip?: string;
    expiresAt: Date;
  }) => Session.create(data),
  findByTokenHash: (tokenHash: string) => Session.findOne({ tokenHash }).exec(),
  findById: (sessionId: string) => Session.findById(sessionId).exec(),
  findByUser: (userId: string) => Session.find({ user: userId }).sort({ createdAt: -1 }).exec(),
  rotate: (sessionId: string, tokenHash: string) =>
    Session.findByIdAndUpdate(
      sessionId,
      { tokenHash, lastUsedAt: new Date() },
      { new: true },
    ).exec(),
  revoke: (sessionId: string) =>
    Session.findByIdAndUpdate(sessionId, { revokedAt: new Date() }, { new: true }).exec(),
  revokeAll: (userId: string) =>
    Session.updateMany({ user: userId, revokedAt: { $exists: false } }, { revokedAt: new Date() }),
};
