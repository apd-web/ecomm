import { ApiError } from "../utils/apiError";
import { env } from "../config/env";

const toUrlEncoded = (data: Record<string, string>) => new URLSearchParams(data).toString();

type OAuthProfile = {
  providerId: string;
  email: string;
  name: string;
  avatarUrl?: string;
};

type ProviderConfig = {
  authUrl: string;
  tokenUrl: string;
  userUrl: string;
  scope: string;
};

export const oauthService = {
  getProviderConfig: (provider: "google" | "github"): ProviderConfig => {
    if (provider === "google") {
      return {
        authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
        tokenUrl: "https://oauth2.googleapis.com/token",
        userUrl: "https://www.googleapis.com/oauth2/v3/userinfo",
        scope: "openid email profile",
      };
    }

    return {
      authUrl: "https://github.com/login/oauth/authorize",
      tokenUrl: "https://github.com/login/oauth/access_token",
      userUrl: "https://api.github.com/user",
      scope: "read:user user:email",
    };
  },
  buildAuthUrl: (provider: "google" | "github", state: string) => {
    const config = oauthService.getProviderConfig(provider);
    const redirectUri = `${env.oauthRedirectBaseUrl}/api/v1/auth/oauth/${provider}/callback`;
    const params = new URLSearchParams({
      client_id: provider === "google" ? env.googleClientId : env.githubClientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: config.scope,
      state,
    });

    return `${config.authUrl}?${params.toString()}`;
  },
  exchangeCode: async (provider: "google" | "github", code: string) => {
    const redirectUri = `${env.oauthRedirectBaseUrl}/api/v1/auth/oauth/${provider}/callback`;
    if (provider === "google") {
      const body = toUrlEncoded({
        client_id: env.googleClientId,
        client_secret: env.googleClientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      });

      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body,
      });

      if (!response.ok) {
        throw new ApiError(400, "Google token exchange failed");
      }

      const data = (await response.json()) as { access_token?: string };
      if (!data.access_token) {
        throw new ApiError(400, "Google access token missing");
      }

      return data.access_token;
    }

    const body = toUrlEncoded({
      client_id: env.githubClientId,
      client_secret: env.githubClientSecret,
      code,
      redirect_uri: redirectUri,
    });

    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "content-type": "application/x-www-form-urlencoded" },
      body,
    });

    if (!response.ok) {
      throw new ApiError(400, "GitHub token exchange failed");
    }

    const data = (await response.json()) as { access_token?: string };
    if (!data.access_token) {
      throw new ApiError(400, "GitHub access token missing");
    }

    return data.access_token;
  },
  fetchProfile: async (
    provider: "google" | "github",
    accessToken: string,
  ): Promise<OAuthProfile> => {
    if (provider === "google") {
      const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) {
        throw new ApiError(400, "Google userinfo fetch failed");
      }

      const data = (await response.json()) as {
        sub?: string;
        email?: string;
        name?: string;
        picture?: string;
      };

      if (!data.sub || !data.email) {
        throw new ApiError(400, "Google userinfo missing required fields");
      }

      return {
        providerId: data.sub,
        email: data.email,
        name: data.name ?? data.email,
        avatarUrl: data.picture,
      };
    }

    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "ecomm-api",
      },
    });

    if (!response.ok) {
      throw new ApiError(400, "GitHub user fetch failed");
    }

    const data = (await response.json()) as {
      id?: number;
      email?: string | null;
      name?: string | null;
      login?: string;
      avatar_url?: string;
    };

    let email = data.email ?? "";
    if (!email) {
      const emailResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
          "User-Agent": "ecomm-api",
        },
      });

      if (emailResponse.ok) {
        const emails = (await emailResponse.json()) as Array<{
          email: string;
          primary: boolean;
          verified: boolean;
        }>;
        const primary = emails.find((entry) => entry.primary && entry.verified) ?? emails[0];
        email = primary?.email ?? "";
      }
    }

    if (!data.id || !email) {
      throw new ApiError(400, "GitHub profile missing required fields");
    }

    return {
      providerId: String(data.id),
      email,
      name: data.name ?? data.login ?? email,
      avatarUrl: data.avatar_url ?? undefined,
    };
  },
};
