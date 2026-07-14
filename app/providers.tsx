"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RainbowKitProvider,
  lightTheme,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { ThemeProvider, useTheme } from "next-themes";
import { useState } from "react";
import { wagmiConfig } from "@/lib/wagmi";
import { useMounted } from "@/lib/use-mounted";

function RainbowKitThemed({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();
  // Server and first client render must agree (light); the real theme
  // applies after hydration to avoid a RainbowKit style mismatch.
  const isDark = mounted && resolvedTheme === "dark";
  const themeOptions = {
    accentColor: isDark ? "oklch(0.72 0.14 255)" : "oklch(0.5 0.14 255)",
    accentColorForeground: isDark ? "black" : "white",
    borderRadius: "medium",
    fontStack: "system",
  } as const;

  return (
    <RainbowKitProvider
      theme={isDark ? darkTheme(themeOptions) : lightTheme(themeOptions)}
    >
      {children}
    </RainbowKitProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitThemed>{children}</RainbowKitThemed>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
