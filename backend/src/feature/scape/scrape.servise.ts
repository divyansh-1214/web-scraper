import Product from '../../models/product.model.js';
import { productType } from '../../models/product.model.js';
type categoryType = "iPhone" | "iPad" | "MacBook" | undefined;
import Offer, { OfferType } from '../../models/offer.model.js';

export const createProduct = async (data: any) => {
  const res = transformProduct(data);
  if (res === null) return null;
  const product = new Product(res);
  return await product.save();
}

export const createOffer = async (data: any) => {
  const res = transformOffer(data);
  if (res === null) return null;
  const offer = new Offer(res);
  return await offer.save();
}

export const deleteProduct = async (id: string) => {
  return await Product.findByIdAndDelete(id);
}

export const isAvailable = async (data: any) => {
  try {
    console.log(data.sourceProductId)
    const offer = await Offer.findOne({ sourceProductId: data.sourceProductId });
    console.log(offer)
    if (offer) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error)
  }
}

export const updateProductAndCheckAvailability = async (data: any) => {
  try {

    const existingOffer = await Offer.findOne({
      source: data.source,
      sourceProductId: data.sourceProductId,
    });
    const offer = transformOffer(data);
    if (!existingOffer) {
      await Offer.create(offer);

      return {
        isAvailable: true,
        changed: true,
      };
    }

    const changed =
      existingOffer.sellingPrice !== offer.sellingPrice ||
      existingOffer.originalPrice !== offer.originalPrice ||
      existingOffer.discountPercent !== offer.discountPercent ||
      existingOffer.isAvailable !== offer.isAvailable;

    if (changed) {
      await Offer.findOneAndUpdate(
        {
          source: data.source,
          sourceProductId: data.sourceProductId,
        },
        offer,
        { new: true }
      );
    }

    return {
      isAvailable: true,
      changed,
    };

  } catch (error) {
    console.log(error)
  }
}

export const transformProduct = (product: any): productType | null => {
  const category: categoryType = product.title.split(" ").find((val: string) => val.toLowerCase() === "iphone" || val.toLowerCase() === "ipad" || val.toLowerCase() === "macbook")
  if (category === undefined) {
    return null
  }
  return {
    source: "flipkart",
    sourceProductId: product.sourceProductId,
    title: product.title,
    brand: "Apple",
    category: category,
    specifications: product.specifications || [],
    imageUrls: product.imageUrl
      ? [product.imageUrl]
      : [],
    rating: product.rating
      ? parseFloat(product.rating)
      : 0,
    ratingCount: product.ratingCount
      ? parseInt(
        product.ratingCount.replace(/,/g, ""),
        10
      )
      : 0,
    productUrl: product.productUrl,
    isAvailable: product.isAvailable ?? true,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastScrapedAt: new Date(),
    lastSeenAt: new Date(),
  };
};


const parseNumericValue = (value: unknown, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return fallback;

  const normalizedValue = value.replace(/[^\d.-]/g, "");
  const parsedValue = Number(normalizedValue);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

export const transformOffer = (product: any): OfferType => {
  const [sellingPrice = 0, originalPrice = 0, discountPercent = 0] = product.price ?? [];

  return {
    sourceProductId: product.sourceProductId,
    source: "flipkart",
    sellingPrice: parseNumericValue(sellingPrice),
    originalPrice: parseNumericValue(originalPrice),
    discountPercent: parseNumericValue(discountPercent),
    isAvailable: product.isAvailable ?? true,
    checkedAt: new Date(),
    createdAt: new Date(),
  };
};
