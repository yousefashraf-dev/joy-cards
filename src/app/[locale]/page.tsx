"use client";

import HeroSection from "@/components/home/HeroSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import ProductsGrid from "@/components/home/ProductsGrid";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <ProductsGrid />
    </>
  );
}
