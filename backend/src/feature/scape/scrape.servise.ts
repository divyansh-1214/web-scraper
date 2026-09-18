import Product from '../../models/product.model.js';
import { productType } from '../../models/product.model.js';

export const createProduct = async (data: productType) => {
  const product = new Product(data);
  await product.save();
}

export const transformProduct = (product: any) => {
  const category = product.title.split(" ").find((val:string) =>  val === "iPhone" || val === "iPad" || val === "MacBook") ?? ""
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
    lastScrapedAt: new Date(),
    lastSeenAt: new Date(),
  };
};
