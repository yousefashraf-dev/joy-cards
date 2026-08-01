"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ProductCardProps {
  title: string;
  description: string;
  cta: string;
  href: string;
  gradient: string;
  icon: React.ReactNode;
  index: number;
}

export default function ProductCard({
  title,
  description,
  cta,
  href,
  gradient,
  icon,
  index,
}: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      <Link href={href}>
        <div className="group relative glass-card rounded-2xl p-8 h-full hover:border-gold/30 transition-all duration-500 overflow-hidden">
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${gradient}`} />
          <div className="relative z-10 flex flex-col h-full">
            <div className="w-14 h-14 rounded-xl bg-matte-black border border-gold/10 flex items-center justify-center mb-6 group-hover:border-gold/30 transition-colors duration-300">
              {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-light mb-3 group-hover:text-gold transition-colors duration-300">
              {title}
            </h3>
            <p className="text-slate-muted text-sm leading-relaxed mb-6 flex-1">
              {description}
            </p>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-gold text-matte-dark font-semibold text-sm hover:opacity-90 group-hover:shadow-[0_0_30px_rgba(198,165,104,0.3)] transition-all duration-300">
              <span>{cta}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
