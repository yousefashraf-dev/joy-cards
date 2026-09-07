import { WHATSAPP_ORDERS_NUMBER } from "./constants";
import type { CatalogProduct, CatalogOrderType, ProductColor, CatalogServiceType } from "./catalog-schema";

export interface CatalogOrderInput {
  product: CatalogProduct;
  color: ProductColor | null;
  serviceType: CatalogServiceType;
  orderType: CatalogOrderType;
  qty: number;
  unitPrice: number;
  discountPercent: number;
  totalPrice: number;
  customerName: string;
  phone: string;
  email?: string;
  notes?: string;
  shippingGovernorate?: string;
  shippingCity?: string;
  shippingAddress?: string;
  restaurantName?: string;
  menuDetail?: string;
  features?: string[];
}

export function whatsappOrderUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_ORDERS_NUMBER}?text=${encodeURIComponent(message)}`;
}

export async function submitCatalogOrder(input: CatalogOrderInput): Promise<{ id: string }> {
  const res = await fetch("/api/catalog-orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productId: input.product.id,
      productSlug: input.product.slug,
      productName: input.product.name,
      color: input.color,
      serviceType: input.serviceType,
      orderType: input.orderType,
      qty: input.qty,
      unitPrice: input.unitPrice,
      discountPercent: input.discountPercent,
      totalPrice: input.totalPrice,
      customerName: input.customerName,
      customerPhone: input.phone,
      customerEmail: input.email || null,
      notes: input.notes || null,
      shippingGovernorate: input.shippingGovernorate || null,
      shippingCity: input.shippingCity || null,
      shippingAddress: input.shippingAddress || null,
      restaurantName: input.restaurantName || null,
      menuDetail: input.menuDetail || null,
      features: input.features && input.features.length > 0 ? input.features : null,
    }),
  });
  if (!res.ok) {
    throw new Error("Order API failed");
  }
  return res.json();
}