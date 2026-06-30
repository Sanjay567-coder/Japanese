"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

const navItems = [
  { href: "/hub",         labelKey: "home"     as const, jaLabel: "ホーム",    enLabel: "Hub"      },
  { href: "/memory-lane", labelKey: "memory"   as const, jaLabel: "おもいで",  enLabel: "Memories" },
  { href: "/arigatou",    labelKey: "arigatou" as const, jaLabel: "ありがとう", enLabel: "Arigatou" },
  { href: "/vocab",       labelKey: "vocab"    as const, jaLabel: "たんご",    enLabel: "Vocab"    },
] as const;

// SVG icons — clean, hand-crafted to match the aesthetic
const NavIcons: Record<string, React.ReactNode> = {
  "/hub": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  "/memory-lane": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  "/arigatou": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  "/vocab": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  ),
};

export default function NavBar() {
  const pathname = usePathname();
  const { lang, t } = useLanguage();

  if (pathname === "/") return null;

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "rgba(250, 246, 240, 0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(201, 163, 123, 0.25)",
        boxShadow: "0 1px 0 rgba(201,163,123,0.15), 0 4px 24px rgba(43,43,43,0.05)",
      }}
    >
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between" style={{ height: "64px" }}>

        {/* Logo / Brand */}
        <Link href="/hub" className="flex items-center gap-3 group" aria-label="Back to hub">
          {/* Hanko-circle logo mark */}
          <div
            className="flex items-center justify-center rounded-full transition-all duration-200 group-hover:scale-105"
            style={{
              width: "36px",
              height: "36px",
              border: "1.5px solid rgba(183,40,46,0.6)",
              color: "var(--color-hanko)",
              fontFamily: "Noto Serif JP, serif",
              fontSize: "0.85rem",
              fontWeight: "500",
              letterSpacing: "0",
            }}
          >
            先
          </div>
          <div className="flex flex-col leading-none">
            <span
              className="text-sm font-semibold"
              style={{ color: "var(--color-indigo)", fontFamily: "Noto Serif JP, serif", letterSpacing: "0.01em" }}
            >
              先生へ
            </span>
            <span
              className="hidden sm:block text-xs mt-0.5"
              style={{ color: "var(--color-wood)", fontFamily: "Inter, sans-serif", letterSpacing: "0.08em" }}
            >
              FAREWELL
            </span>
          </div>
        </Link>

        {/* Nav items */}
        <div className="flex items-center" style={{ gap: "2px" }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const label = lang === "ja" ? item.jaLabel : item.enLabel;

            return (
              <Link key={item.href} href={item.href} aria-label={label}>
                <motion.div
                  className="relative flex items-center gap-2 rounded-xl transition-colors duration-150"
                  style={{
                    padding: "10px 14px",
                    minHeight: "44px",
                    color: isActive ? "var(--color-hanko)" : "var(--color-indigo)",
                    background: isActive ? "rgba(183,40,46,0.07)" : "transparent",
                    fontFamily: lang === "ja" ? "Noto Sans JP, sans-serif" : "Inter, sans-serif",
                    fontSize: "0.8125rem",
                    fontWeight: isActive ? "600" : "450",
                    opacity: isActive ? 1 : 0.75,
                  }}
                  whileHover={{ opacity: 1, background: "rgba(42,58,92,0.05)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  {/* SVG icon */}
                  <span
                    className="flex-shrink-0"
                    style={{ color: isActive ? "var(--color-hanko)" : "var(--color-indigo)", opacity: isActive ? 1 : 0.7 }}
                  >
                    {NavIcons[item.href]}
                  </span>

                  {/* Label — hidden on mobile, shown on sm+ */}
                  <span className="hidden sm:inline whitespace-nowrap">{label}</span>

                  {/* Active underline pill */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute bottom-1.5 left-3 right-3 h-0.5 rounded-full"
                      style={{ background: "var(--color-hanko)" }}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
