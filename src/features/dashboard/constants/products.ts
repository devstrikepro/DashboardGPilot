import { SERVICE_BASE_GOLDENBOY, SERVICE_BASE_GPILOT, SERVICE_BASE_HQULTIMATE, SERVICE_BASE_PPVP, SERVICE_BASE_SAFEGROW } from "@/shared/api/endpoint";

export interface ProductInfo {
  id: string;
  title: string;
  initials: string;
  serviceBase: string;
}

export const PRODUCTS: Record<string, ProductInfo> = {
  safegrow: {
    id: "safegrow",
    title: "Safe Grow",
    initials: "SG",
    serviceBase: SERVICE_BASE_SAFEGROW,
  },
  gpilot: {
    id: "gpilot",
    title: "G pilot",
    initials: "GP",
    serviceBase: SERVICE_BASE_GPILOT,
  },
  hqultimate: {
    id: "hqultimate",
    title: "HQ บางระจัน",
    initials: "HQ",
    serviceBase: SERVICE_BASE_HQULTIMATE,
  },
  ppvp: {
    id: "ppvp",
    title: "กุมารเงิน",
    initials: "PP",
    serviceBase: SERVICE_BASE_PPVP,
  },
  goldenboy: {
    id: "goldenboy",
    title: "กุมารทอง",
    initials: "GB",
    serviceBase: SERVICE_BASE_GOLDENBOY,
  },
};
