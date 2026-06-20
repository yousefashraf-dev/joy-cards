"use client";

import HeroSection from "@/components/home/HeroSection";
import LiveStatsCounter from "@/components/home/LiveStatsCounter";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CafeShowcaseSection from "@/components/home/CafeShowcaseSection";
import ReviewGallery from "@/components/home/ReviewGallery";
import FaqAccordion from "@/components/home/FaqAccordion";
import ProductsGrid from "@/components/home/ProductsGrid";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LiveStatsCounter />
      <HowItWorksSection />
      <CafeShowcaseSection />
      <ReviewGallery />
      <ProductsGrid />
      <FaqAccordion />
    </>
  );
}
