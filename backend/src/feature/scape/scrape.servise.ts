import Product from '../../models/product.model.js';

export const createProduct = async (data: any) => {
  const product = new Product(data);
  await product.save();
}

export const transformProduct = (product: any) => {
  return {
    source: "flipkart",
    sourceProductId: product.sourceProductId,
    title: product.title,
    brand: "Apple",
    category: "Laptop",
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
