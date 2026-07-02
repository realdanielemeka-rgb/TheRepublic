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
    "The Republic is a global agency based in Lagos, Nigeria, working in brand building, campaign execution, and driving growth through influencer marketing, user-generated content, and performance marketing.",
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
