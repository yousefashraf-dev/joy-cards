import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import HeroSection from "@/components/home/HeroSection";
import ShopProducts from "@/components/shop/ShopProducts";
import WhyGoTapSection from "@/components/home/WhyGoTapSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CafeShowcaseSection from "@/components/home/CafeShowcaseSection";
import TrustSection from "@/components/home/TrustSection";
import ProductsGrid from "@/components/home/ProductsGrid";
import FaqAccordion from "@/components/home/FaqAccordion";
import StickyCta from "@/components/home/StickyCta";

interface HomePageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "homeMeta" });
  return {
    title: t("title"),
    description: t("desc"),
    openGraph: {
      title: t("title"),
      description: t("desc"),
      type: "website",
      locale,
      siteName: "GoTap",
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GoTap",
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}${locale === "ar" ? "/ar" : ""}`,
    inLanguage: locale,
    potentialAction: {
      "@type": "SearchAction",
      target: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/shop`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main>
        <HeroSection />
        <ShopProducts />
        <WhyGoTapSection />
        <HowItWorksSection />
        <CafeShowcaseSection />
        <TrustSection />
        <ProductsGrid />
        <FaqAccordion />
        <StickyCta />
      </main>
    </>
  );
}