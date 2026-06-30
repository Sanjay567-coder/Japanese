import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/language-context";
import { AudioProvider } from "@/lib/audio-context";
import SakuraPetals from "@/components/ui/SakuraPetals";
import LanguageToggle from "@/components/ui/LanguageToggle";
import NavBar from "@/components/ui/NavBar";

export const metadata: Metadata = {
  title: "Sayonara, Sensei Gowrisankar | さようなら、ゴウリサンカル先生",
  description:
    "A bilingual farewell website from your Japanese language students. Thank you for every song, story, and kanji. / 日本語のクラスの学生からの、おわかれのウェブサイトです。",
  keywords: [
    "Japanese language",
    "Sensei Gowrisankar",
    "farewell",
    "さようなら",
    "先生",
    "日本語",
    "Japanese class",
  ],
  openGraph: {
    title: "Sayonara, Sensei Gowrisankar",
    description:
      "A heartfelt bilingual farewell from your Japanese language class students.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;500;700&family=Inter:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LanguageProvider>
          <AudioProvider>
            {/* Background sakura petals — always visible */}
            <SakuraPetals />

            {/* Floating language toggle — always visible */}
            <LanguageToggle />

            {/* Navigation bar — hidden on entrance page */}
            <NavBar />

            {/* Page content */}
            <div className="relative z-10">
              {children}
            </div>
          </AudioProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
