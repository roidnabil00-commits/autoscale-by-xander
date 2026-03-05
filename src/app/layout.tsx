import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Perbaikan: Menggunakan alias @/ dan penulisan PascalCase yang tepat
import Header from "../components/header";
import Footer from "../components/footer";
import ReferralTracker from "../components/referraltracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AutoScale by Xander Systems | Solusi Eksekusi Penjualan SaaS & Teknologi",
    template: "%s | AutoScale Xander",
  },
  description: "Marketplace aset teknologi dan SaaS. AutoScale menjembatani produk perangkat lunak terbaik dengan entitas bisnis yang membutuhkannya.",
  keywords: [
    "SaaS Indonesia", 
    "Marketplace Software", 
    "B2B Tech Solutions", 
    "Xander Systems", 
    "AutoScale", 
    "Lisensi Aplikasi", 
    "Source Code Bisnis"
  ],
  authors: [{ name: "Bil Xander" }],
  creator: "Xander Systems",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://autoscale-opal.vercel.app/",
    title: "AutoScale - Jembatan Produk Teknologi Bisnis",
    description: "Semua orang bisa membuat software, kami tahu cara menjualnya untuk bisnis Anda.",
    siteName: "AutoScale",
    images: [
      {
        url: "/abil.png", // Akan muncul saat link dibagikan di WhatsApp/LinkedIn
        width: 1200,
        height: 630,
        alt: "AutoScale by Xander Systems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoScale by Xander Systems",
    description: "Sistem distribusi dan penjualan perangkat lunak untuk B2B.",
    creator: "@xandersystems",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans flex flex-col min-h-screen`}>
        {/* Komponen pelacak referal berjalan di latar belakang */}
        <ReferralTracker />
        
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}