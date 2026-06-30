"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

const navItems = [
  { href: "/hub", labelKey: "home" as const, icon: "⛩️" },
  { href: "/memory-lane", labelKey: "memory" as const, icon: "🌸" },
  { href: "/arigatou", labelKey: "arigatou" as const, icon: "📝" },
  { href: "/vocab", labelKey: "vocab" as const, icon: "🖌️" },
] as const;

export default function NavBar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  // Don't render on entrance page
  if (pathname === "/") return null;

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 glass"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        borderBottom: "1px solid rgba(201, 163, 123, 0.3)",
        boxShadow: "0 2px 20px rgba(43, 43, 43, 0.06)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/hub"
          className="flex items-center gap-2 group"
          aria-label="Home"
        >
          <span
            className="text-lg"
            style={{ fontFamily: "Noto Serif JP, serif", color: "var(--color-indigo)" }}
          >
            先生
          </span>
          <span
            className="hidden sm:block text-xs tracking-widest uppercase opacity-60"
            style={{ color: "var(--color-indigo)", fontFamily: "Inter, sans-serif" }}
          >
            Farewell
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className="relative px-3 py-1.5 rounded-lg text-sm transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    color: isActive ? "var(--color-hanko)" : "var(--color-indigo)",
                    background: isActive ? "rgba(183, 40, 46, 0.08)" : "transparent",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: isActive ? "600" : "400",
                  }}
                >
                  <span className="mr-1 text-xs">{item.icon}</span>
                  <span className="hidden sm:inline">
                    {t(translations.nav[item.labelKey])}
                  </span>
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                      style={{ background: "var(--color-hanko)" }}
                      layoutId="nav-indicator"
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
