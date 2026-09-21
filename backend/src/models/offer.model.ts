import mongoose from "mongoose";

export interface OfferType {
  sourceProductId: string;
  source: string;
  sellingPrice: number;
  originalPrice?: number;
  discountPercent?: number;
  isAvailable: boolean;
  checkedAt: Date;
  createdAt: Date;
}

const offerSchema = new mongoose.Schema(
  {
    sourceProductId: {
      type: String,
      required: true,
      index: true,
    },

    source: {
      type: String,
      required: true,
      default: "flipkart",
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    originalPrice: {
      type: Number,
      min: 0,
    },

    discountPercent: {
      type: Number,
      min: 0,
      max: 100,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    checkedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

offerSchema.index({
  productId: 1,
  source: 1,
  seller: 1,
});

export default mongoose.model("Offer", offerSchema);
