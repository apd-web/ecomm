import { ApiError } from "../utils/apiError";
import { comparePassword, hashPassword } from "../utils/password";
import {
  getTokenExpiry,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { hashToken } from "../utils/tokenHash";
import { sessionRepository } from "../repositories/sessionRepository";
import { userRepository } from "../repositories/userRepository";
import { tokenService } from "./tokenService";
import { env } from "../config/env";

type AuthContext = {
  userAgent?: string;
  ip?: string;
};

const toSafeUser = (user: {
  id: string;
  name: string;
  email: string;
  roles: string[];
  provider: string;
  emailVerified: boolean;
}) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  roles: user.roles,
  provider: user.provider,
  emailVerified: user.emailVerified,
});

const buildSession = async (refreshToken: string, userId: string, context?: AuthContext) => {
  const expiresAt = getTokenExpiry(refreshToken);
  if (!expiresAt) {
    throw new ApiError(500, "Invalid refresh token expiry");
  }

  return sessionRepository.create({
    user: userId,
    tokenHash: hashToken(refreshToken),
    userAgent: context?.userAgent,
    ip: context?.ip,
    expiresAt,
  });
};

const issueTokensForUser = async (
  user: {
    id: string;
    roles: string[];
    name: string;
    email: string;
    provider: string;
    emailVerified: boolean;
  },
  context?: AuthContext,
) => {
  const payload = { sub: user.id, roles: user.roles };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  await buildSession(refreshToken, user.id, context);

  return {
    user: toSafeUser(user),
    accessToken,
    refreshToken,
  };
};

export const authService = {
  findUserByEmail: (email: string) => userRepository.findByEmail(email),
  register: async (name: string, email: string, password: string, context?: AuthContext) => {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new ApiError(409, "Email already in use");
    }

    const passwordHash = await hashPassword(password);
    const user = await userRepository.create({ name, email, passwordHash, provider: "local" });

    await tokenService.issueEmailVerification(user.id, user.email);
    return issueTokensForUser(user, context);
  },
  login: async (email: string, password: string, context?: AuthContext) => {
    const user = await userRepository.findByEmail(email);
    if (!user || !user.passwordHash) {
      throw new ApiError(401, "Invalid credentials");
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials");
    }

    if (env.requireEmailVerification && !user.emailVerified) {
      throw new ApiError(403, "Email not verified");
    }

    return issueTokensForUser(user, context);
  },
  refresh: async (refreshToken: string, context?: AuthContext) => {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new ApiError(401, "Invalid refresh token");
    }

    const tokenHash = hashToken(refreshToken);
    const session = await sessionRepository.findByTokenHash(tokenHash);
    if (!session || session.revokedAt) {
      throw new ApiError(401, "Refresh session not found");
    }

    if (session.expiresAt.getTime() <= Date.now()) {
      throw new ApiError(401, "Refresh token expired");
    }

    const user = await userRepository.findById(payload.sub);
    if (!user) {
      throw new ApiError(401, "User not found");
    }

    const newPayload = { sub: user.id, roles: user.roles };
    const accessToken = signAccessToken(newPayload);
    const newRefreshToken = signRefreshToken(newPayload);
    await sessionRepository.rotate(session.id, hashToken(newRefreshToken));
    if (context?.userAgent || context?.ip) {
      session.userAgent = context?.userAgent ?? session.userAgent;
      session.ip = context?.ip ?? session.ip;
      await session.save();
    }

    return {
      user: toSafeUser(user),
      accessToken,
      refreshToken: newRefreshToken,
    };
  },
  logout: async (refreshToken: string) => {
    const tokenHash = hashToken(refreshToken);
    const session = await sessionRepository.findByTokenHash(tokenHash);
    if (session && !session.revokedAt) {
      await sessionRepository.revoke(session.id);
    }
  },
  issueTokensForUser,
};
