import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  mongoUri: process.env.MONGODB_URI ?? "",
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? "",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? "",
  jwtAccessTtl: process.env.JWT_ACCESS_TTL ?? "15m",
  jwtRefreshTtl: process.env.JWT_REFRESH_TTL ?? "7d",
  refreshCookieName: process.env.REFRESH_COOKIE_NAME ?? "refreshToken",
  refreshCookieMaxAgeMs: Number(process.env.REFRESH_COOKIE_MAX_AGE_MS ?? 604800000),
  verifyEmailTtl: process.env.VERIFY_EMAIL_TTL ?? "1h",
  resetPasswordTtl: process.env.RESET_PASSWORD_TTL ?? "1h",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  emailFrom: process.env.EMAIL_FROM ?? "no-reply@ecomm.local",
  appBaseUrl: process.env.APP_BASE_URL ?? "http://localhost:5173",
  requireEmailVerification: process.env.REQUIRE_EMAIL_VERIFICATION === "true",
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  githubClientId: process.env.GITHUB_CLIENT_ID ?? "",
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
  oauthRedirectBaseUrl: process.env.OAUTH_REDIRECT_BASE_URL ?? "http://localhost:4000",
};
