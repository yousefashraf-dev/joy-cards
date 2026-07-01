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

function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

export function generateScatter(config: ScatterConfig): ScatterItem[] {
  const items: ScatterItem[] = [];
  const minDist = 14;
  const maxAttempts = 30;
  for (let i = 0; i < config.count; i++) {
    let top = Math.floor(Math.random() * 82) + 5;
    let left = Math.floor(Math.random() * 82) + 2;
    let placed = false;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      top = Math.floor(Math.random() * 82) + 5;
      left = Math.floor(Math.random() * 82) + 2;
      let tooClose = false;
      for (const item of items) {
        const exTop = parseFloat(item.top);
        const exLeft = parseFloat(item.left);
        if (distance(top, left, exTop, exLeft) < minDist) {
          tooClose = true;
          break;
        }
      }
      if (!tooClose) {
        placed = true;
        break;
      }
    }
    if (!placed) {
      // use last attempted position
    }
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
