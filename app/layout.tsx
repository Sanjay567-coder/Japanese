import type { Metadata } from "next";
import "./globals.css";
import SakuraPetals from "@/components/ui/SakuraPetals";

export const metadata: Metadata = {
  title: "A Tribute to Gowrisankar Sensei",
  description:
    "A card-based narrative tribute and farewell from the students of Gowrisankar Sensei's Japanese language class.",
  keywords: [
    "Gowrisankar Sensei",
    "farewell tribute",
    "Japanese language class",
    "memory lane",
  ],
  openGraph: {
    title: "A Tribute to Gowrisankar Sensei",
    description:
      "A card-based narrative tribute and farewell from the students of Gowrisankar Sensei's Japanese language class.",
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
        {/* Background sakura petals — always visible */}
        <SakuraPetals />

        {/* Page content */}
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
