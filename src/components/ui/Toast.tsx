"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, X } from "lucide-react";
import { useToast } from "./ToastProvider";

export default function Toast() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-6 end-6 z-[110] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.4 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-2xl max-w-sm w-full ${
              toast.type === "success"
                ? "bg-neon-green/10 border-neon-green/30"
                : "bg-neon-red/10 border-neon-red/30"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-neon-red shrink-0 mt-0.5" />
            )}
            <p
              className={`text-sm flex-1 ${
                toast.type === "success" ? "text-slate-light" : "text-slate-light"
              }`}
            >
              {toast.message}
            </p>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-slate-muted hover:text-slate-light transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
