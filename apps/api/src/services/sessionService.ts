import { ApiError } from "../utils/apiError";
import { sessionRepository } from "../repositories/sessionRepository";

export const sessionService = {
  listForUser: async (userId: string) => {
    const sessions = await sessionRepository.findByUser(userId);
    return sessions.map((session) => ({
      id: session.id,
      userAgent: session.userAgent,
      ip: session.ip,
      createdAt: session.createdAt,
      lastUsedAt: session.lastUsedAt,
      expiresAt: session.expiresAt,
      revokedAt: session.revokedAt,
    }));
  },
  revoke: async (sessionId: string, userId: string) => {
    const session = await sessionRepository.findById(sessionId);
    if (!session || session.user.toString() !== userId) {
      throw new ApiError(404, "Session not found");
    }
    await sessionRepository.revoke(sessionId);
  },
  revokeAll: async (userId: string) => {
    await sessionRepository.revokeAll(userId);
  },
};
