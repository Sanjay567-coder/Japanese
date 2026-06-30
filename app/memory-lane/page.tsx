import fs from "fs";
import path from "path";
import MemoryLaneClient from "@/components/screens/MemoryLaneClient";

export const metadata = {
  title: "Memory Lane | Gowrisankar Sensei",
  description: "A look back at the moments, stories, and songs shared in class.",
};

export default function MemoryLanePage() {
  const imagesDir = path.join(process.cwd(), "public", "assets", "images");
  let images: string[] = [];

  try {
    if (fs.existsSync(imagesDir)) {
      const files = fs.readdirSync(imagesDir);
      // Filter for common image extensions and sort them alphabetically
      images = files
        .filter((file) => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
        .sort()
        .map((file) => `/assets/images/${file}`);
    }
  } catch (error) {
    console.error("Error reading images directory:", error);
  }

  // Fallback to defaults if no images were found
  if (images.length === 0) {
    images = [
      "/assets/images/image1.jpeg",
      "/assets/images/image2.jpeg",
      "/assets/images/image3.jpeg",
    ];
  }

  return <MemoryLaneClient images={images} />;
}
