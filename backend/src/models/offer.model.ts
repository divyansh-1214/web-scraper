import mongoose from "mongoose";

export interface IOffer {
  productId: mongoose.Types.ObjectId;
  source: string;
  seller: string;
  sellingPrice: number;
  originalPrice?: number;
  discountPercent?: number;
  isAvailable: boolean;
  checkedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const offerSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    source: {
      type: String,
      required: true,
      default: "flipkart",
    },

    seller: {
      type: String,
      required: true,
      trim: true,
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

module.exports = mongoose.model("Offer", offerSchema);
