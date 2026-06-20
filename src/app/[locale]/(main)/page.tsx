"use client";

import HeroSection from "@/components/home/HeroSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CafeShowcaseSection from "@/components/home/CafeShowcaseSection";
import ProductsGrid from "@/components/home/ProductsGrid";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <CafeShowcaseSection />
      <ProductsGrid />
    </>
  );
}
