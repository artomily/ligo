// MockUSDT on Base Sepolia (contracts/src/MockUSDT.sol).
// Address comes from env so the same code can point at any deployment
// (or Circle's testnet USDC as a fallback — note that has no faucet()).
export const USDT_ADDRESS = (process.env.NEXT_PUBLIC_USDT_ADDRESS ||
  "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const USDT_CONFIGURED =
  USDT_ADDRESS !== "0x0000000000000000000000000000000000000000";

export const USDT_DECIMALS = 6;

export const usdtAbi = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function",
    name: "faucet",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "event",
    name: "Transfer",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "value", type: "uint256", indexed: false },
    ],
  },
] as const;
