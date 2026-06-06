import type { Metadata } from "next";
import { Noto_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

const notoSans = Noto_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sulemanbooks.com"),
  title: "Suleman Books | Your Trusted Bookstore in Pakistan",
  description: "Discover a wide variety of books at Suleman Books. We offer educational, fictional, and non-fictional books at the best prices with fast delivery across Pakistan.",
  keywords: ["books", "bookstore", "pakistan", "buy books online", "suleman books", "academic books", "novels"],
  authors: [{ name: "Suleman Books" }],
  openGraph: {
    title: "Suleman Books | Your Trusted Bookstore",
    description: "Discover a wide variety of books at Suleman Books. Fast delivery across Pakistan.",
    url: "https://sulemanbooks.com",
    siteName: "Suleman Books",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg", // You can replace this with your actual logo/banner path
        width: 1200,
        height: 630,
        alt: "Suleman Books Banner",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Suleman Books | Your Trusted Bookstore",
    description: "Buy books online at the best prices with fast delivery.",
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${notoSans.variable} ${playfairDisplay.variable} antialiased min-h-screen bg-background`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
