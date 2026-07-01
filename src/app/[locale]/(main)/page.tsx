"use client";

import HeroSection from "@/components/home/HeroSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CafeShowcaseSection from "@/components/home/CafeShowcaseSection";
import FaqAccordion from "@/components/home/FaqAccordion";
import ProductsGrid from "@/components/home/ProductsGrid";
import ShopProducts from "@/components/shop/ShopProducts";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ShopProducts />
      <HowItWorksSection />
      <CafeShowcaseSection />
      <ProductsGrid />
      <FaqAccordion />
    </>
  );
}
