import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { baseSepolia } from "wagmi/chains";

// WalletConnect Cloud project id. Injected wallets (MetaMask etc.) work
// without a real id; WalletConnect QR pairing needs one from
// https://cloud.reown.com — set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID.
const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "LIGO_DEV_PLACEHOLDER";

export const wagmiConfig = getDefaultConfig({
  appName: "Ligo",
  projectId,
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
  ssr: true,
});
