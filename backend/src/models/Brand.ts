import mongoose from "mongoose";

export type BrandDocument = mongoose.Document & {
  name: string;
  slug: string;
  logoUrl?: string;
  website?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const brandSchema = new mongoose.Schema<BrandDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    logoUrl: { type: String },
    website: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

brandSchema.index({ slug: 1 }, { unique: true });
brandSchema.index({ name: "text" });

export const Brand = mongoose.model<BrandDocument>("Brand", brandSchema);
