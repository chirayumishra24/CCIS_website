import type { Metadata } from "next";
import { Playfair_Display, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Cambridge Court International School | Best IB & CBSE School in Jaipur",
    template: "%s | Cambridge Court International School",
  },
  description:
    "Cambridge Court International School (CCIS), Jaipur — a premium dual-curriculum (IB + CBSE) day school offering outstanding academic achievements, world-class amenities, and holistic growth.",
  keywords: [
    "Cambridge Court International School",
    "CCIS",
    "Best CBSE school Jaipur",
    "Best IB school Jaipur",
    "best school in Jaipur",
    "day boarding school Jaipur",
    "top school Mansarovar Jaipur",
    "CBSE affiliation 1730867",
  ],
  authors: [{ name: "Cambridge Court International School" }],
  creator: "Cambridge Court International School",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Cambridge Court International School",
    title: "Cambridge Court International School | Best IB & CBSE School in Jaipur",
    description:
      "A premium dual-curriculum day school with a global vision and solid Indian values.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "Cambridge Court International School Campus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cambridge Court International School",
    description:
      "Best IB & CBSE School in Jaipur — Academic excellence and holistic development.",
    images: ["https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} ${ibmPlexMono.variable} font-sans antialiased bg-white text-ink`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:bg-navy focus:text-white focus:px-4 focus:py-2 focus:rounded-sm focus:font-mono focus:text-xs focus:uppercase focus:tracking-wider"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="min-h-screen pt-[116px] md:pt-[124px]">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
