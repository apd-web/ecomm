import mongoose from "mongoose";

export type OAuthProvider = "google" | "github";

export type OAuthAccountDocument = mongoose.Document & {
  user: mongoose.Types.ObjectId;
  provider: OAuthProvider;
  providerId: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
};

const oauthAccountSchema = new mongoose.Schema<OAuthAccountDocument>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
    email: { type: String },
    name: { type: String },
    avatarUrl: { type: String },
  },
  { timestamps: true },
);

oauthAccountSchema.index({ provider: 1, providerId: 1 }, { unique: true });

oauthAccountSchema.index({ user: 1, provider: 1 }, { unique: true });

export const OAuthAccount = mongoose.model<OAuthAccountDocument>(
  "OAuthAccount",
  oauthAccountSchema,
);
