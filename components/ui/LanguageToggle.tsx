"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

export default function LanguageToggle() {
  const { lang, toggleLang } = useLanguage();
  const label = lang === "en" ? translations.toggle.switchTo.en : translations.toggle.switchTo.ja;

  return (
    <motion.button
      id="lang-toggle-btn"
      onClick={toggleLang}
      className="hanko-stamp fixed top-4 right-4 z-50 w-14 h-14 text-xs font-bold select-none"
      whileTap={{ scale: 0.9, rotate: -5 }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.4 }}
      title={lang === "en" ? "日本語に切り替える" : "Switch to English"}
      aria-label={lang === "en" ? "Switch to Japanese" : "Switch to English"}
      style={{
        background: lang === "ja" ? "rgba(183, 40, 46, 0.08)" : "transparent",
      }}
    >
      <span
        className="font-jp text-xs leading-tight text-center"
        style={{ color: "var(--color-hanko)", fontFamily: "Noto Serif JP, serif" }}
      >
        {label}
      </span>
    </motion.button>
  );
}
