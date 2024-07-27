import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProviderClient from "../lib/SessionProviderCient"

 
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VOYAGE",
  description: "Travel with us",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProviderClient>{children}</SessionProviderClient>
      </body>
    </html>
  );
}