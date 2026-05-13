import type { Metadata } from "next";
import { Bagel_Fat_One, Nunito, Lora, Caveat } from "next/font/google";
import "./globals.css";

const bagel = Bagel_Fat_One({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const nunito = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const caveat = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Pookers Bookclub",
  description: "Pedro & Laura's monthly two-book bookclub.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bagel.variable} ${nunito.variable} ${lora.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#A48871] text-[#2D1F15]">{children}</body>
    </html>
  );
}
