import type { RequestHandler } from "express";

import { ok } from "../utils/apiResponse";
import { env } from "../config/env";

const supportedProviders = ["google", "github"] as const;

type Provider = (typeof supportedProviders)[number];

const isProvider = (value: string): value is Provider =>
  supportedProviders.includes(value as Provider);

export const oauthStart: RequestHandler = (req, res) => {
  const provider = req.params.provider;
  if (!isProvider(provider)) {
    return res.status(400).json({ error: { message: "Unsupported provider" } });
  }

  const configured =
    provider === "google"
      ? Boolean(env.googleClientId && env.googleClientSecret)
      : Boolean(env.githubClientId && env.githubClientSecret);

  res.json(
    ok({
      provider,
      message: configured ? "OAuth configured" : "OAuth setup pending",
      next: configured ? "Implement provider redirect" : `Configure ${provider} OAuth credentials`,
    }),
  );
};

export const oauthCallback: RequestHandler = (req, res) => {
  const provider = req.params.provider;
  if (!isProvider(provider)) {
    return res.status(400).json({ error: { message: "Unsupported provider" } });
  }

  res.json(
    ok({
      provider,
      message: "OAuth callback placeholder",
    }),
  );
};
