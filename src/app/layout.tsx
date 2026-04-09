import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Lancer VTT | Omninet Terminal",
  description: "Advanced tactical interface for Lancer RPG",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased overflow-hidden">
        <div className="fixed inset-0 pointer-events-none z-50 scanlines opacity-[0.03]" />
        <div className="fixed inset-0 pointer-events-none z-40 bg-grid-pattern bg-[length:30px_30px]" />
        <main className="relative z-10 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
