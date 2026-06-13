"use client";

import { motion } from "framer-motion";
import { Lock, Shield } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Link from "next/link";

export default function PendingProfile() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-matte-black p-4">
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-cyan/10 animate-pulse" />
          <div className="relative w-full h-full rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-cyan/70" />
          </div>
        </div>

        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-cyan/30 to-transparent mx-auto mb-6" />

        <h1 className="text-2xl font-bold text-slate-light mb-4">
          الرابط غير نشط حالياً
        </h1>

        <p className="text-slate-muted text-sm leading-relaxed mb-8">
          هذا الرابط غير نشط حالياً، سيتم التفعيل فور تأكيد الدفع من الإدارة.
        </p>

        <div className="flex items-center justify-center gap-2 text-xs text-slate-muted/60 mb-8 p-3 rounded-xl bg-white/[0.03] border border-white/5">
          <Shield className="w-3.5 h-3.5 text-cyan/50" />
          <span>GoTap — هوية رقمية آمنة</span>
        </div>

        <Link href="/">
          <PrimaryButton>
            العودة إلى الصفحة الرئيسية
          </PrimaryButton>
        </Link>
      </motion.div>
    </div>
  );
}
