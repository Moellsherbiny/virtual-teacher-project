import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import NextAuthProvider from "./context/NextAuthProvider";
import Transition from "./Transition";
import Navbar from "@/components/common/header/navbar";
import Footer from "@/components/common/footer";
import { Toaster } from "@/components/ui/toaster";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "الروبوت الافتراضي",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body dir="rtl" suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextAuthProvider>
              <Transition>
                <Navbar />
                {children}
                <Toaster />
                <Footer />
              </Transition>
            </NextAuthProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
