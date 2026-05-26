import mongoose from "mongoose";

export type OrderItem = {
  product: mongoose.Types.ObjectId;
  variant?: string | null;
  sku?: string | null;
  price: number;
  quantity: number;
};

export type OrderDocument = mongoose.Document & {
  user: mongoose.Types.ObjectId;
  items: OrderItem[];
  status: string;
  totalAmount: number;
  currency: string;
  paymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
};

const orderSchema = new mongoose.Schema<OrderDocument>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        variant: { type: String },
        sku: { type: String },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    status: { type: String, default: "pending", index: true },
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    paymentIntentId: { type: String },
  },
  { timestamps: true },
);

export const Order = mongoose.model<OrderDocument>("Order", orderSchema);
