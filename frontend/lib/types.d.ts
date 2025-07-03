
export type Product = {
  url: string;
  currency: string;
  image: string;
  title: string;
  currentPrice: number;
  originalPrice: number;
  discountRate: number;
  description: string;
  category: string;
  reviewsCount: number;
  stars: number;
};

// export type NotificationType =
//   | "WELCOME"
//   | "CHANGE_OF_STOCK"
//   | "LOWEST_PRICE"
//   | "THRESHOLD_MET";

// export type EmailContent = {
//   subject: string;
//   body: string;
// };

// export type EmailProductInfo = {
//   title: string;
//   url: string;
// };