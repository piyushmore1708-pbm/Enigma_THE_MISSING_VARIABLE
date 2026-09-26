import type { Metadata } from "next";
import "./globals.css";
import { EstateProvider } from "@/context/EstateContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Claim Sathi | Digital Estate & Financial Closure Assistant",
  description:
    "Empathetic, structured financial estate closure and claim settlement platform tailored for Indian families. Navigating RBI, EPFO, EDLI, and bank deceased depositor claims.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-teal-100 selection:text-teal-900">
        <EstateProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <Footer />
        </EstateProvider>
      </body>
    </html>
  );
}
