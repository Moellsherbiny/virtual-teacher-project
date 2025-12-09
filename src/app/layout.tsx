
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import NextAuthProvider from "./context/NextAuthProvider";
import Transition from "./Transition";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/footer";
import { Toaster } from "@/components/ui/sonner"
import TopHeader from "@/components/common/header/Header";
import { getCurrentLocale } from "@/i18n/currentLocale";
import { NextIntlClientProvider } from "next-intl"
import RobotSDK from "@/components/Assistant";
import { Cairo } from "next/font/google";

export const metadata: Metadata = {
  title: "الروبوت الافتراضي",
  description: "",
};

const cairo = Cairo({
  variable: "--font-cairo",
  display: "swap",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = getCurrentLocale();
  return (
    <>
      <html lang={locale} suppressHydrationWarning>
        <head />
        <body dir={locale === "ar" ? "rtl" : "ltr"} suppressHydrationWarning className={`${cairo.className} antialiased transition-transform duration-100`}>
          <NextIntlClientProvider>

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
                  <Toaster position="top-center" />
                  <RobotSDK />
                  <Footer />
                </Transition>
              </NextAuthProvider>
            </ThemeProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </>
  );
}
