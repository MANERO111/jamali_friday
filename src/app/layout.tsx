import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
// Default Navbar (Uncomment after Black Friday ends)
// import Navbar from "@/components/navbar";

// Black Friday Navbar (Comment this out and uncomment Navbar after Black Friday ends)
import Navbar from "@/components/bf_navbar";

import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "jamaliexpress",
  description: "jamaliexpress",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <AuthProvider>
          <CartProvider>
          <Navbar />
            {children}
          <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
