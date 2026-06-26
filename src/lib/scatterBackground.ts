import type { CSSProperties } from "react";

export interface ScatterConfig {
  count: number;
  sources: string[];
  minSize: number;
  maxSize: number;
  opacity: number;
}

export interface ScatterItem {
  top: string;
  left: string;
  src: string;
  style: CSSProperties;
}

export function generateScatter(config: ScatterConfig): ScatterItem[] {
  const items: ScatterItem[] = [];
  for (let i = 0; i < config.count; i++) {
    const top = Math.floor(Math.random() * 88) + 2;
    const left = Math.floor(Math.random() * 88) - 5;
    const deg = Math.floor(Math.random() * 120) - 60;
    const size = Math.floor(Math.random() * (config.maxSize - config.minSize) + config.minSize);
    const src = config.sources[i % config.sources.length];
    items.push({
      top: `${top}%`,
      left: `${left}%`,
      src,
      style: {
        width: size,
        height: size,
        opacity: config.opacity,
        transform: `rotate(${deg}deg)`,
      },
    });
  }
  return items;
}
