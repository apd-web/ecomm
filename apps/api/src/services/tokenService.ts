import { ApiError } from "../utils/apiError";
import { env } from "../config/env";
import { authTokenRepository } from "../repositories/authTokenRepository";
import { hashToken } from "../utils/tokenHash";
import { generateToken } from "../utils/token";
import { toMs } from "../utils/time";
import { emailTemplates } from "../utils/emailTemplates";
import { emailService } from "./emailService";
import { userRepository } from "../repositories/userRepository";

export const tokenService = {
  issueEmailVerification: async (userId: string, email: string) => {
    const token = generateToken();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + toMs(env.verifyEmailTtl, 3600000));

    await authTokenRepository.revokeExisting(userId, "verify_email");
    await authTokenRepository.create({ user: userId, tokenHash, type: "verify_email", expiresAt });

    const template = emailTemplates.verifyEmail(token);
    await emailService.send({
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });

    return token;
  },
  issuePasswordReset: async (email: string) => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const token = generateToken();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + toMs(env.resetPasswordTtl, 3600000));

    await authTokenRepository.revokeExisting(user.id, "reset_password");
    await authTokenRepository.create({
      user: user.id,
      tokenHash,
      type: "reset_password",
      expiresAt,
    });

    const template = emailTemplates.resetPassword(token);
    await emailService.send({
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });

    return token;
  },
  verifyEmailToken: async (token: string) => {
    const tokenHash = hashToken(token);
    const record = await authTokenRepository.findActive(tokenHash, "verify_email");
    if (!record) {
      throw new ApiError(400, "Invalid or expired token");
    }
    if (record.expiresAt.getTime() <= Date.now()) {
      throw new ApiError(400, "Token expired");
    }

    await authTokenRepository.markUsed(record.id);
    await userRepository.markEmailVerified(record.user.toString());
  },
  resetPassword: async (token: string, newPasswordHash: string) => {
    const tokenHash = hashToken(token);
    const record = await authTokenRepository.findActive(tokenHash, "reset_password");
    if (!record) {
      throw new ApiError(400, "Invalid or expired token");
    }
    if (record.expiresAt.getTime() <= Date.now()) {
      throw new ApiError(400, "Token expired");
    }

    await authTokenRepository.markUsed(record.id);
    await userRepository.updatePassword(record.user.toString(), newPasswordHash);
  },
};
