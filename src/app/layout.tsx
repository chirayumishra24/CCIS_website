import type { Metadata } from "next";
import Script from "next/script";
import { Playfair_Display, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://ccis.skilizee.com"),
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
        url: "/images/home_hero1.png",
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
    images: ["/images/home_hero1.png"],
  },
  icons: {
    icon: "/logo/Subtitlelogo.png",
    shortcut: "/logo/Subtitlelogo.png",
    apple: "/logo/Subtitlelogo.png",
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
        className={`${inter.variable} ${playfair.variable} ${ibmPlexMono.variable} font-sans antialiased bg-slate-50/60 text-ink relative min-h-screen overflow-x-hidden`}
      >
        {/* Global Ambient Maroon Accent Background */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#701516]/[0.04] blur-[140px]" />
          <div className="absolute top-[30%] -left-40 w-[500px] h-[500px] rounded-full bg-[#701516]/[0.035] blur-[120px]" />
          <div className="absolute top-[65%] -right-40 w-[600px] h-[600px] rounded-full bg-[#701516]/[0.03] blur-[150px]" />
          <div className="absolute inset-0 bg-[radial-gradient(#701516_0.8px,transparent_0.8px)] [background-size:36px_36px] opacity-[0.03]" />
        </div>

        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:bg-navy focus:text-white focus:px-4 focus:py-2 focus:rounded-sm focus:font-mono focus:text-xs focus:uppercase focus:tracking-wider"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="relative z-10 min-h-screen pt-[64px] sm:pt-[104px] lg:pt-[106px]">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
        <Script id="collect-chat" strategy="afterInteractive">
          {`
            (function(w, d) {
              w.CollectId = "6880d106c7613c5d1548ae53";
              var h = d.head || d.getElementsByTagName("head")[0];
              var s = d.createElement("script");
              s.setAttribute("type", "text/javascript");
              s.async = true;
              s.setAttribute("src", "https://collectcdn.com/launcher.js");
              h.appendChild(s);
            })(window, document);
          `}
        </Script>
      </body>
    </html>
  );
}
