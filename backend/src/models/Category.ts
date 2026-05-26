import mongoose from "mongoose";

export type CategoryDocument = mongoose.Document & {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parent?: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const categorySchema = new mongoose.Schema<CategoryDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ name: "text", description: "text" });

export const Category = mongoose.model<CategoryDocument>("Category", categorySchema);
