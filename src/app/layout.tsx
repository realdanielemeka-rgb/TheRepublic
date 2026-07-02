import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import CustomCursor from "@/components/CustomCursor";
import "./globals.css";

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Republic Studios — Design & Marketing Agency",
  description:
    "The Republic Studios is a design and marketing studio in Lagos, Nigeria building brand strategy, digital products, growth marketing and motion for ambitious companies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground cursor-none-desktop">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
