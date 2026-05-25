import mongoose from "mongoose";

type Provider = "local" | "google" | "github";

export type UserRole = "admin" | "user" | "moderator";

export type UserDocument = mongoose.Document & {
  email: string;
  passwordHash?: string;
  name: string;
  roles: UserRole[];
  provider: Provider;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String },
    name: { type: String, required: true },
    roles: { type: [String], default: ["user"] },
    provider: { type: String, default: "local" },
    emailVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const User = mongoose.model<UserDocument>("User", userSchema);
