import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/authContext";
import { Toaster } from "react-hot-toast";
import MobileBlocker from "@/components/MobileBlocker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mood Home Interiors - Inventory System",
  description: "Inventory management system for Mood Home Interiors",
  icons: {
    icon: "/images/logo.png",
  },
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <MobileBlocker>{children}</MobileBlocker>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
