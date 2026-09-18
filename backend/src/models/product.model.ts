import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: true,
      default: "flipkart",
    },

    sourceProductId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      trim: true,
      default: "Apple"
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    specifications: {
      type: Map,
      of: String,
      default: {},
    },

    imageUrls: {
      type: [String],
      default: [],
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
    },

    ratingCount: {
      type: Number,
      default: 0,
    },

    productUrl: {
      type: String,
      required: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    lastScrapedAt: {
      type: Date,
      default: null,
    },

    lastSeenAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


// A product should be unique within a source
productSchema.index(
  { source: 1, sourceProductId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Product", productSchema);
