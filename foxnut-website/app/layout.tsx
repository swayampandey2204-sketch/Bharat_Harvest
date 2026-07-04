import type { Metadata } from "next";
import { WishlistProvider } from "@/contexts/WishlistContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bharat Harvest — Premium Artisanal Fox Nuts",
  description:
    "Discover India's most premium Fox Nut (Makhana) snacks. Handpicked from Bihar's wetlands, roasted to perfection. High protein, low calorie, 100% natural.",
  keywords: "fox nut, makhana, healthy snacks, protein snacks, india, lotus seeds, bharat harvest",
  openGraph: {
    title: "Bharat Harvest — Premium Artisanal Fox Nuts",
    description: "Premium Fox Nuts handpicked from Bihar's wetlands.",
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <WishlistProvider>
          {children}
        </WishlistProvider>
      </body>
    </html>
  );
}

