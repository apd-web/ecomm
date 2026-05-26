import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config();

// In monorepos, `process.cwd()` can be the repo root when running filtered scripts.
// Explicitly try the API package `.env` (and then repo root `.env`) so required
// vars like MONGODB_URI are consistently loaded.
if (!process.env.MONGODB_URI) {
  const apiEnvPath = fileURLToPath(new URL("../../../.env", import.meta.url));
  const result = dotenv.config({ path: apiEnvPath });
  if (process.env.MONGODB_URI === "" && result.parsed?.MONGODB_URI) {
    process.env.MONGODB_URI = result.parsed.MONGODB_URI;
  }
}

if (!process.env.MONGODB_URI) {
  const repoEnvPath = fileURLToPath(new URL("../../../../.env", import.meta.url));
  const result = dotenv.config({ path: repoEnvPath });
  if (process.env.MONGODB_URI === "" && result.parsed?.MONGODB_URI) {
    process.env.MONGODB_URI = result.parsed.MONGODB_URI;
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  mongoUri: process.env.MONGODB_URI ?? "",
  skipDb: process.env.SKIP_DB === "true",
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
