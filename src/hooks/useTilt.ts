"use client";

import { useCallback } from "react";

export function useTilt(max = 10) {
  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    },
    [max]
  );

  const onMouseLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  }, []);

  return { handlers: { onMouseMove, onMouseLeave } };
}