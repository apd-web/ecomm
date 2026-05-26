import { OAuthAccount } from "../models/OAuthAccount";

export const oauthAccountRepository = {
  findByProviderId: (provider: string, providerId: string) =>
    OAuthAccount.findOne({ provider, providerId }).populate("user").exec(),
  findByUserProvider: (userId: string, provider: string) =>
    OAuthAccount.findOne({ user: userId, provider }).exec(),
  countByUser: (userId: string) => OAuthAccount.countDocuments({ user: userId }).exec(),
  deleteByUserProvider: (userId: string, provider: string) =>
    OAuthAccount.findOneAndDelete({ user: userId, provider }).exec(),
  create: (data: {
    user: string;
    provider: string;
    providerId: string;
    email?: string;
    name?: string;
    avatarUrl?: string;
  }) => OAuthAccount.create(data),
};
