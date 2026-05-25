import mongoose from "mongoose";

type TokenType = "verify_email" | "reset_password";

export type AuthTokenDocument = mongoose.Document & {
  user: mongoose.Types.ObjectId;
  tokenHash: string;
  type: TokenType;
  expiresAt: Date;
  usedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

const authTokenSchema = new mongoose.Schema<AuthTokenDocument>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tokenHash: { type: String, required: true, index: true },
    type: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
    usedAt: { type: Date },
  },
  { timestamps: true },
);

authTokenSchema.index({ user: 1, type: 1 });

export const AuthToken = mongoose.model<AuthTokenDocument>("AuthToken", authTokenSchema);
