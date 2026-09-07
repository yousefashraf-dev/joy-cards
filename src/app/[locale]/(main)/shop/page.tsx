import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import SectionHeading from "@/components/ui/SectionHeading";
import ShopCatalog from "@/components/shop/ShopCatalog";
import StickyCta from "@/components/home/StickyCta";
import { LOCAL_CATALOG } from "@/lib/catalog-data";
import { getShopProducts } from "@/lib/catalog-data";
import { categoryHasColors } from "@/lib/catalog-schema";

interface ShopPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: ShopPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "shop" });
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDesc"),
      type: "website",
      locale,
      siteName: "GoTap",
    },
  };
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "shop" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("shopTitle"),
    itemListElement: getShopProducts(LOCAL_CATALOG)
      .map((p, i) => ({
        "@type": "Product",
        position: i + 1,
        name: p.name[locale],
        description: p.description[locale],
        brand: { "@type": "Brand", name: "GoTap" },
        image: p.images[0] ? `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}${p.images[0]}` : undefined,
        offers: {
          "@type": "Offer",
          priceCurrency: "EGP",
          price: p.base_price,
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          category: p.category,
          color: categoryHasColors(p.category) ? p.available_colors : undefined,
        },
      }))
      .filter((item) => item.image),
  };

  return (
    <div className="min-h-screen bg-matte-black pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-muted hover:text-gold transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          {t("backHome")}
        </Link>

        <SectionHeading title={t("shopTitle")} subtitle={t("shopSub")} />

        <ShopCatalog />
      </div>

      <StickyCta />
    </div>
  );
}