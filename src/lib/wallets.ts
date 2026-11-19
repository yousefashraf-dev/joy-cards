export type WalletProvider = "vodafone" | "orange" | "etisalat" | "we";

export const WALLET_PROVIDERS: { value: WalletProvider; label: string }[] = [
  { value: "vodafone", label: "Vodafone Cash" },
  { value: "orange", label: "Orange Cash" },
  { value: "etisalat", label: "Etisalat Cash" },
  { value: "we", label: "WE Pay" },
];

export const WALLET_LABELS: Record<WalletProvider, string> = {
  vodafone: "Vodafone Cash",
  orange: "Orange Cash",
  etisalat: "Etisalat Cash",
  we: "WE Pay",
};

export function normalizeProvider(value: unknown): WalletProvider {
  return value === "orange" || value === "etisalat" || value === "we"
    ? value
    : "vodafone";
}

export function walletTransferCode(provider: WalletProvider, number: string): string {
  switch (provider) {
    case "orange":
      return "*7115#";
    case "etisalat":
      return "*777*1#";
    case "we":
      return "*7#";
    case "vodafone":
    default:
      return `*9*7*${number}#`;
  }
}

export function walletTelLink(provider: WalletProvider, number: string): string {
  const trimmed = number.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `tel:${encodeURIComponent(walletTransferCode(provider, trimmed))}`;
}
