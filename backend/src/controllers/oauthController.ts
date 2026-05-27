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
const getLinkCookieName = (provider: Provider) => `oauth_link_${provider}`;

const isSafeRedirect = (value: string) => value.startsWith("/") || value.startsWith(env.appBaseUrl);

const clearOauthCookies = (res: Parameters<RequestHandler>[1], provider: Provider) => {
  res.clearCookie(getStateCookieName(provider));
  res.clearCookie(`oauth_redirect_${provider}`);
  res.clearCookie(getLinkCookieName(provider));
};

export const oauthStart: RequestHandler = asyncHandler(async (req, res) => {
  const provider = req.params.provider as string;
  if (!provider || !isProvider(provider)) {
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

export const oauthLinkStart: RequestHandler = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const provider = req.params.provider as string;
  if (!provider || !isProvider(provider)) {
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

  res.cookie(getLinkCookieName(provider), req.user.sub, {
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

  const authUrl = oauthService.buildAuthUrl(provider, state);
  if (req.query.mode === "json") {
    return res.json(ok({ url: authUrl }));
  }

  res.redirect(authUrl);
});

export const oauthCallback: RequestHandler = asyncHandler(async (req, res) => {
  const provider = req.params.provider as string;
  if (!provider || !isProvider(provider)) {
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

  const linkUserId = req.cookies?.[getLinkCookieName(provider)] as string | undefined;
  if (linkUserId) {
    const linkUser = await userRepository.findById(linkUserId);
    if (!linkUser) {
      clearOauthCookies(res, provider);
      throw new ApiError(404, "User not found");
    }

    if (existingAccount && existingAccount.user.toString() !== linkUser.id) {
      clearOauthCookies(res, provider);
      throw new ApiError(409, "OAuth account already linked");
    }

    const existingLink = await oauthAccountRepository.findByUserProvider(linkUser.id, provider);
    if (existingLink && (!existingAccount || existingAccount.id !== existingLink.id)) {
      clearOauthCookies(res, provider);
      throw new ApiError(409, "Provider already linked");
    }

    if (!existingAccount) {
      await oauthAccountRepository.create({
        user: linkUser.id,
        provider,
        providerId: profile.providerId,
        email: profile.email,
        name: profile.name,
        avatarUrl: profile.avatarUrl,
      });
    }

    clearOauthCookies(res, provider);
    const redirect = req.cookies?.[`oauth_redirect_${provider}`] as string | undefined;
    if (redirect && isSafeRedirect(redirect)) {
      return res.redirect(redirect);
    }

    return res.json(ok({ success: true }));
  }

  let user = existingAccount?.user
    ? await userRepository.findById(existingAccount.user.toString())
    : null;
  if (!user) {
    const existingUser = await userRepository.findByEmail(profile.email);
    if (existingUser) {
      if (env.requireEmailVerification && !existingUser.emailVerified && !profile.emailVerified) {
        clearOauthCookies(res, provider);
        throw new ApiError(403, "Email not verified");
      }
      user = existingUser;
    } else {
      if (env.requireEmailVerification && !profile.emailVerified) {
        clearOauthCookies(res, provider);
        throw new ApiError(403, "Email not verified");
      }
      user = await userRepository.create({
        email: profile.email,
        name: profile.name,
        emailVerified: Boolean(profile.emailVerified),
        provider,
      });
    }

    await oauthAccountRepository.create({
      user: user._id.toString(),
      provider,
      providerId: profile.providerId,
      email: profile.email,
      name: profile.name,
      avatarUrl: profile.avatarUrl,
    });
  }

  if (!user) {
    throw new ApiError(500, "Failed to fetch user data");
  }

  const result = await authService.issueTokensForUser(
    {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      roles: user.roles || [],
      provider: "oauth",
      emailVerified: user.emailVerified,
    },
    {
      userAgent: req.get("user-agent") ?? undefined,
      ip: req.ip,
    },
  );

  setRefreshCookie(res, result.refreshToken);
  clearOauthCookies(res, provider);

  const redirect = req.cookies?.[`oauth_redirect_${provider}`] as string | undefined;
  if (redirect && isSafeRedirect(redirect)) {
    return res.redirect(redirect);
  }

  res.json(ok(result));
});

export const oauthUnlink: RequestHandler = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const provider = req.params.provider as string;
  if (!provider || !isProvider(provider)) {
    throw new ApiError(400, "Unsupported provider");
  }

  const user = await userRepository.findById(req.user.sub);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const existingLink = await oauthAccountRepository.findByUserProvider(user.id, provider);
  if (!existingLink) {
    throw new ApiError(404, "Provider not linked");
  }

  const linkCount = await oauthAccountRepository.countByUser(user.id);
  if (!user.passwordHash && linkCount <= 1) {
    throw new ApiError(400, "Cannot unlink last sign-in method");
  }

  await oauthAccountRepository.deleteByUserProvider(user.id, provider);
  res.json(ok({ success: true }));
});
