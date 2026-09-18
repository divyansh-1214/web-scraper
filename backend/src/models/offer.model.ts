import mongoose from "mongoose";

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
const mongoose = require("mongoose");

const priceHistorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
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

    checkedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

priceHistorySchema.index({
  productId: 1,
  checkedAt: -1,
});

module.exports = mongoose.model("PriceHistory", priceHistorySchema);
