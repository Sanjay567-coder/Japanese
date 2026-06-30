"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { Language, TranslationEntry } from "./translations";

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: (entry: TranslationEntry) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  toggleLang: () => {},
  t: (entry) => entry.en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "en" ? "ja" : "en"));
  }, []);

  const t = useCallback(
    (entry: TranslationEntry): string => entry[lang],
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
