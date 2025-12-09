"use client";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ArrowRight, ArrowUpRight, Bot } from "lucide-react";
import { Card } from "../ui/card";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Hero() {
  const [bars, setBars] = useState<number[]>([]);
  const t = useTranslations('home');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const session = useSession();
  useEffect(() => {
    setBars(Array.from({ length: 10 }, () => Math.random() * 100));
  }, []);

  return (
    <section className="relative overflow-hidden py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text Content */}
          <div className={`flex-1 text-center ${isRtl ? 'lg:text-right' : 'lg:text-left'}`}>
            <Badge className="mb-4 animate-fade-in">
              {t("hero.badge")}
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
              {t("hero.title")}{' '}
              <span className="text-orange-500 dark:text-orange-400 relative">
                {t("hero.highlight")}
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-200 dark:text-blue-900 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {t("hero.subtitle")}
            </p>
            <div className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start`}>
              {session.data?.user ?
                <Button className="bg-orange-600 hover:bg-orange-500 h-12 px-8 text-lg rounded-full" asChild>
                  <Link href="/dashboard">
                    {t("cta.dashboard")}
                    <ArrowUpRight size={18} />
                  </Link>
                </Button>
                :
                <>
                  <Button className="h-12 px-8 text-lg rounded-full">
                    {t("hero.cta_primary")}
                    <ArrowRight className={`w-5 h-5 ${isRtl ? 'mr-2 rotate-180' : 'ml-2'}`} />
                  </Button>
                  <Button variant="outline" className="h-12 px-8 text-lg rounded-full">
                    {t("hero.cta_secondary")}
                  </Button>
                </>
              }
            </div>

           
          </div>

          {/* Hero Visual */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

            <Card className="relative overflow-hidden border-2 border-slate-100 dark:border-slate-800 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="flex-1 text-center text-xs font-mono text-slate-400">virtual-teacher-app</div>
              </div>
              <div className="p-8 space-y-6">
                {/* Chat Bubble AI */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
                    <Bot className="text-white w-6 h-6" />
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none max-w-[80%]">
                    <div className="flex gap-2 mb-2">
                      <span className="w-8 h-1 bg-blue-500 rounded-full animate-pulse" />
                      <span className="w-8 h-1 bg-blue-500 rounded-full animate-pulse delay-75" />
                      <span className="w-8 h-1 bg-blue-500 rounded-full animate-pulse delay-150" />
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      Hello! I noticed you paused on the Quadratic Formula. Would you like me to explain it using a visual example or a voice note?
                    </p>
                  </div>
                </div>

                {/* Chat Bubble User */}
                <div className="flex gap-4 flex-row-reverse">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-xs">YOU</span>
                  </div>
                  <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none max-w-[80%]">
                    <p className="text-sm">
                      Yes, please explain it with a voice note.
                    </p>
                  </div>
                </div>

                {/* Voice Visualizer Mock */}
                <div className="flex items-center justify-center gap-1 h-12 mt-4">
                  {bars.map((height, i) => (
                    <div
                      key={i}
                      className="w-1 bg-orange-500 rounded-full animate-music"
                      style={{
                        height: `${height}%`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};