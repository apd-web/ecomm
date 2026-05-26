import type { RequestHandler } from "express";
import crypto from "node:crypto";

import { ok } from "../utils/apiResponse";
import { env } from "../config/env";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { oauthService } from "../services/oauthService";
import { oauthAccountRepository } from "../repositories/oauthAccountRepository";
import { userRepository } from "../repositories/userRepository";
import { authService } from "../services/authService";
import { setRefreshCookie } from "../utils/cookies";

const supportedProviders = ["google", "github"] as const;

type Provider = (typeof supportedProviders)[number];

const isProvider = (value: string): value is Provider =>
  supportedProviders.includes(value as Provider);

const getProviderConfigured = (provider: Provider) =>
  provider === "google"
    ? Boolean(env.googleClientId && env.googleClientSecret)
    : Boolean(env.githubClientId && env.githubClientSecret);

const getStateCookieName = (provider: Provider) => `oauth_state_${provider}`;

const isSafeRedirect = (value: string) => value.startsWith("/") || value.startsWith(env.appBaseUrl);

export const oauthStart: RequestHandler = asyncHandler(async (req, res) => {
  const provider = req.params.provider;
  if (!isProvider(provider)) {
    throw new ApiError(400, "Unsupported provider");
  }

  if (!getProviderConfigured(provider)) {
    throw new ApiError(400, `Configure ${provider} OAuth credentials`);
  }

  const state = crypto.randomBytes(24).toString("hex");
  const redirect = typeof req.query.redirect === "string" ? req.query.redirect : undefined;

  res.cookie(getStateCookieName(provider), state, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    maxAge: 10 * 60 * 1000,
  });

  if (redirect && isSafeRedirect(redirect)) {
    res.cookie(`oauth_redirect_${provider}`, redirect, {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: "lax",
      maxAge: 10 * 60 * 1000,
    });
  }

  res.redirect(oauthService.buildAuthUrl(provider, state));
});

export const oauthCallback: RequestHandler = asyncHandler(async (req, res) => {
  const provider = req.params.provider;
  if (!isProvider(provider)) {
    throw new ApiError(400, "Unsupported provider");
  }

  if (!getProviderConfigured(provider)) {
    throw new ApiError(400, `Configure ${provider} OAuth credentials`);
  }

  const code = typeof req.query.code === "string" ? req.query.code : "";
  const state = typeof req.query.state === "string" ? req.query.state : "";
  const storedState = req.cookies?.[getStateCookieName(provider)] as string | undefined;

  if (!code || !state || !storedState || storedState !== state) {
    throw new ApiError(400, "Invalid OAuth state");
  }

  const accessToken = await oauthService.exchangeCode(provider, code);
  const profile = await oauthService.fetchProfile(provider, accessToken);

  const existingAccount = await oauthAccountRepository.findByProviderId(
    provider,
    profile.providerId,
  );

  let user = existingAccount?.user ?? null;
  if (!user) {
    const existingUser = await userRepository.findByEmail(profile.email);
    if (existingUser) {
      user = existingUser;
    } else {
      user = await userRepository.create({
        email: profile.email,
        name: profile.name,
        provider,
        emailVerified: true,
      });
    }

    await oauthAccountRepository.create({
      user: user.id,
      provider,
      providerId: profile.providerId,
      email: profile.email,
      name: profile.name,
      avatarUrl: profile.avatarUrl,
    });
  }

  const result = await authService.issueTokensForUser(user, {
    userAgent: req.get("user-agent") ?? undefined,
    ip: req.ip,
  });

  setRefreshCookie(res, result.refreshToken);

  const redirect = req.cookies?.[`oauth_redirect_${provider}`] as string | undefined;
  if (redirect && isSafeRedirect(redirect)) {
    return res.redirect(redirect);
  }

  res.json(ok(result));
});
