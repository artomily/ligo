import Link from "next/link";
import Image from "next/image";

const footerLinks = [
  { href: "/communities", label: "Communities" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold">
            <Image
              src="/logo-mark.svg"
              alt=""
              width={24}
              height={24}
              className="size-6 rounded-md"
            />
            Ligo
          </p>
          <p className="mt-2 max-w-sm text-xs leading-5 text-muted-foreground">
            Fan communities trading, supporting, and celebrating together.
            Payments settle in USDT on Base Sepolia (testnet).
          </p>
        </div>
        <nav
          className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground"
          aria-label="Footer"
        >
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
