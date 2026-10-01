import type { Metadata } from "next";
import { Anton, Bricolage_Grotesque, Newsreader } from "next/font/google";
import "./globals.css";

const ui = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ui",
  display: "swap",
});

const news = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-news",
  display: "swap",
});

/** Stand-in for Graphicxell's Riking until the licensed TTF is in public/fonts. */
const riking = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-riking",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Organic Market and Café",
  description:
    "Organic Market and Café in Stirling, Adelaide Hills. Organic and whole foods, a vegetarian-focused café, and an online shop.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${ui.variable} ${news.variable} ${riking.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
