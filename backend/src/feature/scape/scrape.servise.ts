import Product from '../../models/product.model.js';
import { productType } from '../../models/product.model.js';

export const createProduct = async (data: productType) => {
  try {
    // const updatedData = {...data, createdAt: new Date(), updatedAt: new Date()}
    const product = new Product(data);
    await product.save();
  } catch (error) {
    console.error(error);
  }
}
type categoryType = "iPhone" | "iPad" | "MacBook" | undefined;

export const transformProduct = (product: any) => {
  const category: categoryType = product.title.split(" ").find((val: string) => val.toLowerCase() === "iPhone" || val.toLowerCase() === "iPad" || val.toLowerCase() === "MacBook")
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
    lastScrapedAt: new Date(),
    lastSeenAt: new Date(),
  };
};
