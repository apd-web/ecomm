import mongoose from "mongoose";

type ProductStatus = "active" | "draft" | "archived";

type ProductImage = {
  url: string;
  alt?: string;
};

type InventoryInfo = {
  sku?: string;
  quantity: number;
  lowStockThreshold: number;
  track: boolean;
};

type VariantInfo = {
  name?: string;
  sku?: string;
  price?: number;
  quantity?: number;
  track?: boolean;
  attributes?: Record<string, string>;
};

export type ProductDocument = mongoose.Document & {
  name: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  status: ProductStatus;
  tags: string[];
  images: ProductImage[];
  brand?: mongoose.Types.ObjectId;
  categories: mongoose.Types.ObjectId[];
  featured: boolean;
  ratingAvg: number;
  ratingCount: number;
  inventory: InventoryInfo;
  variants: VariantInfo[];
  createdAt: Date;
  updatedAt: Date;
};

const imageSchema = new mongoose.Schema<ProductImage>(
  {
    url: { type: String, required: true },
    alt: { type: String },
  },
  { _id: false },
);

const inventorySchema = new mongoose.Schema<InventoryInfo>(
  {
    sku: { type: String },
    quantity: { type: Number, required: true, default: 0 },
    lowStockThreshold: { type: Number, required: true, default: 5 },
    track: { type: Boolean, default: true },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema<ProductDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number },
    currency: { type: String, default: "USD" },
    status: { type: String, default: "draft" },
    tags: { type: [String], default: [] },
    images: { type: [imageSchema], default: [] },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    categories: { type: [mongoose.Schema.Types.ObjectId], ref: "Category", default: [] },
    featured: { type: Boolean, default: false },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    inventory: { type: inventorySchema, default: () => ({}) },
    variants: {
      type: [
        new mongoose.Schema(
          {
            name: { type: String },
            sku: { type: String },
            price: { type: Number },
            quantity: { type: Number, default: 0 },
            track: { type: Boolean, default: true },
            attributes: { type: Object, default: {} },
          },
          { _id: true },
        ),
      ],
      default: [],
    },
  },
  { timestamps: true },
);

productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ status: 1, price: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ categories: 1 });
productSchema.index({ name: "text", description: "text" });

export const Product = mongoose.model<ProductDocument>("Product", productSchema);
