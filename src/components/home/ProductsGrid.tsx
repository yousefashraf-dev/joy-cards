"use client";

import { useTranslations } from "next-intl";
import { CreditCard, Car, Store } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/ui/ProductCard";

export default function ProductsGrid() {
  const t = useTranslations("products");

  const products = [
    {
      key: "digitalCards",
      href: "/digital-cards",
      gradient: "bg-gradient-to-br from-gold/20 via-gold/5 to-transparent",
      icon: <CreditCard className="w-7 h-7 text-gold" />,
    },
    {
      key: "autoTap",
      href: "/auto-tap",
      gradient: "bg-gradient-to-br from-gold/20 via-gold/5 to-transparent",
      icon: <Car className="w-7 h-7 text-gold" />,
    },
    {
      key: "businessTap",
      href: "/business-tap",
      gradient: "bg-gradient-to-br from-gold/20 via-gold/5 to-transparent",
      icon: <Store className="w-7 h-7 text-gold" />,
    },
  ];

  return (
    <section id="products" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t("title")}
        />

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product, i) => (
            <ProductCard
              key={product.key}
              title={t(`${product.key}.title`)}
              description={t(`${product.key}.desc`)}
              cta={t(`${product.key}.cta`) || "Order Now"}
              href={product.href}
              gradient={product.gradient}
              icon={product.icon}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
