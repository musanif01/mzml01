import type { Metadata } from "next";
import { Rye, Courier_Prime } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const rye = Rye({
  weight: "400",
  variable: "--font-western",
  subsets: ["latin"],
});

const courierPrime = Courier_Prime({
  weight: ["400", "700"],
  variable: "--font-typewriter",
  subsets: ["latin"],
});

const departureMono = localFont({
  src: "../public/fonts/DepartureMono-Regular.woff2",
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MZML Corp - Software Development Agency",
  description: "Premium software solutions crafted with precision. Custom software, web development, app development, UI/UX design, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${rye.variable} ${courierPrime.variable} ${departureMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
