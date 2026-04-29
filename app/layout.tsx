import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../style/globals.css";
import VerticalNavbar from "@/components/common/VerticalNavbar";
import Footer from "@/components/common/Footer";
import Chatbot from "@/components/chatbot/Chatbot";
import Providers from "./providers";
import ThreeBackground from "@/components/ui/ThreeBackground";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PulseScope – Explorez les tendances audio‑visuelles",
  description: "YouTube, Spotify, podcasts… en un seul endroit.",
  icons: { icon: "/img/icon/favicon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex">
        <ThreeBackground variant="default" />
        <Providers>
          <VerticalNavbar />
          <main className="flex-1 ml-20 md:ml-24 transition-all duration-300 relative z-10">
            {children}
            <Footer />
          </main>
          <Chatbot />
        </Providers>
      </body>
    </html>
  );
}