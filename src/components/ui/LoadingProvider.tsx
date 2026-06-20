"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useTranslations } from "next-intl";

interface LoadingContextType {
  isLoading: boolean;
  message: string;
  showLoading: (msg?: string) => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  message: "",
  showLoading: () => {},
  hideLoading: () => {},
});

export function useLoading() {
  return useContext(LoadingContext);
}

export default function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const tm = useTranslations("messages");

  const showLoading = useCallback((msg?: string) => {
    setMessage(msg || tm("loading"));
    setIsLoading(true);
  }, [tm]);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
    setMessage("");
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, message, showLoading, hideLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}
