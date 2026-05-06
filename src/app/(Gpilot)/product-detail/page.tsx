import { Metadata } from "next";
import ProductDetailPage from "@/features/product-detail/ProductDetailPage";
import { apiServer } from "@/shared/api/api-server";
import { ENDPOINTS, API_GATEWAY_SUB } from "@/shared/api/endpoint";
import type { ServiceResponse, ProductDetail } from "@/shared/types/api";

interface PageProps {
  searchParams: Promise<{ name?: string; base?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const productName = params.name || "Product Detail";
  
  return {
    title: `${productName} | GPilot`,
    description: `Real-time performance and metrics for ${productName}.`,
  };
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const serviceBase = params.base || API_GATEWAY_SUB;
  let initialData: ProductDetail | null = null;

  try {
    // ดึงข้อมูลสินค้าเฉพาะทางตั้งแต่บน Server
    const response = await apiServer<ServiceResponse<ProductDetail>>(
      ENDPOINTS.PRODUCT_DETAIL,
      { cache: 'no-store' },
      undefined, // AnalyticsService pass base as serviceBase, but apiServer expects it as 4th arg
      serviceBase
    );

    if (response.success && response.data) {
      initialData = response.data;
    }
  } catch (error) {
    console.error("Failed to fetch product detail on server:", error);
  }

  return <ProductDetailPage initialData={initialData} />;
}
