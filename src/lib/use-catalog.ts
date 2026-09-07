"use client";

import { useEffect, useState } from "react";
import type { CatalogProduct } from "./catalog-schema";
import { LOCAL_CATALOG } from "./catalog-data";

let cache: CatalogProduct[] | null = null;
let inflight: Promise<CatalogProduct[]> | null = null;

export function useCatalog() {
  const [products, setProducts] = useState<CatalogProduct[]>(cache ?? LOCAL_CATALOG);
  const [loading, setLoading] = useState(cache === null);

  useEffect(() => {
    if (cache) return;
    if (!inflight) {
      inflight = fetch("/api/catalog")
        .then((r) => (r.ok ? r.json() : []))
        .then((data) => {
          const list = Array.isArray(data) && data.length > 0 ? data : LOCAL_CATALOG;
          cache = list;
          return list;
        })
        .catch(() => LOCAL_CATALOG);
    }
    let active = true;
    inflight.then((list) => {
      if (active) {
        setProducts(list);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return { products, loading };
}