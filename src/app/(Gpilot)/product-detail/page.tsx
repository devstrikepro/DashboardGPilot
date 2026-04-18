import { Metadata } from "next";
import ProductDetailPage from "@/features/product-detail/ProductDetailPage";

export const metadata: Metadata = {
  title: "Product Detail | Gpilot",
  description: "Real-time product performance and metrics.",
};

export default function Page() {
  return <ProductDetailPage />;
}
