import { OAuthAccount } from "../models/OAuthAccount";

export const oauthAccountRepository = {
  findByProviderId: (provider: string, providerId: string) =>
    OAuthAccount.findOne({ provider, providerId }).populate("user").exec(),
  create: (data: {
    user: string;
    provider: string;
    providerId: string;
    email?: string;
    name?: string;
    avatarUrl?: string;
  }) => OAuthAccount.create(data),
};
