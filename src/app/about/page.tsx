"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  MessageSquare,
  BookOpen,
  ClipboardCheck,
  CreditCard,
  BarChart3,
  Brain,
  Search,
  MessageCircle,
  Sparkles,
  Zap,
  Rocket,
  Stars
} from "lucide-react";

import RobotHead from "@/components/RobotHead";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function About() {
  const t = useTranslations("about");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    audioRef.current?.play().catch(() => { });
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((p) => (p + 1) % 5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);


  const capabilities = [
    {
      icon: MessageSquare,
      ...t.raw("capabilities.0")
    },
    {
      icon: BookOpen,
      ...t.raw("capabilities.1")
    },
    {
      icon: ClipboardCheck,
      ...t.raw("capabilities.2")
    },
    {
      icon: CreditCard,
      ...t.raw("capabilities.3")
    },
    {
      icon: BarChart3,
      ...t.raw("capabilities.4")
    }
  ];

  const workflowSteps = [
    { icon: MessageCircle, ...t.raw("workflow.0") },
    { icon: Brain, ...t.raw("workflow.1") },
    { icon: Search, ...t.raw("workflow.2") },
    { icon: Sparkles, ...t.raw("workflow.3") },
    { icon: Zap, ...t.raw("workflow.4") }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-white relative overflow-hidden">
      <div className="background-grid fixed inset-0 pointer-events-none z-0"></div>

      <audio ref={audioRef} className="hidden">
        <source src="/audio/info-robot.mp3" type="audio/mpeg" />
      </audio>

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20 space-y-16 md:space-y-24">
        {/* Hero */}
        <div className={`text-center space-y-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="flex justify-center mb-8">
            <RobotHead />
          </div>

          <Badge className="mx-auto px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 border-0 text-white text-base">
            <Sparkles className="w-4 h-4 ml-2 inline animate-spin" />
            {t("aiPowered")}
          </Badge>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black gradient-text">
            {t("heroTitle")}
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t("heroSubtitle")}
          </p>
        </div>

        {/* Intro Card */}
        <Card className="">
          <CardContent className="p-8 md:p-12 text-center space-y-6">
            <Rocket className="w-12 h-12 text-orange-400 mx-auto" />
            <h2 className="text-4xl font-bold gradient-text-small">{t("introTitle")}</h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t("introText")}
            </p>
          </CardContent>
        </Card>

        {/* Capabilities */}
        <div className="space-y-8">
          <Badge className="text-xl px-6 py-2 bg-gradient-to-r bg-orange-600 dark:text-white hover:text-orange-600 hover:bg-transparent border-2 border-orange-600 ">
            <Stars className="w-4 h-4 ml-2 inline" />
            {t("capabilitiesTitle")}
          </Badge>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <Card key={idx} className="dark:bg-white/10 backdrop-blur-xl dark:border-white/10  p-6">
                  <Icon className="w-8 h-8 text-white mb-4" />
                  <h3 className="text-xl font-bold">{cap.title}</h3>
                  <p className="text-gray-400 text-sm mt-2">{cap.description}</p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Workflow */}
        <div className="space-y-8">
          <Badge className="px-8 text-xl px py-2 bg-gradient-to-r bg-orange-600 dark:text-white hover:text-orange-600 hover:bg-transparent border-2 border-orange-600 ">
            <Zap className="w-4 h-4 ml-2 inline" />
            {t("workflowTitle")}
          </Badge>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <Card key={idx} className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <Icon className="w-6 h-6" />
                    <Badge>{idx + 1}</Badge>
                  </div>
                  <h3 className="text-lg font-bold">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.description}</p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-orange-300 via-orange-600 to-orange-400 border-0">
          <CardContent className="p-12 md:p-16 text-center space-y-6">
            <h3 className="text-4xl font-black text-white">{t("ctaTitle")}</h3>
            <p className="text-white/90 text-lg">{t("ctaSubtitle")}</p>

            <div className="flex justify-center gap-4 mt-6">
              <Button variant={"secondary"} asChild>
               <Link href="/auth/sign-up">
                {t("ctaStart")}
               </Link>
              </Button>
             
            </div>
          </CardContent>
        </Card>
      </div>
      <style jsx>{`
  /* responsive grid for light + dark mode */
  .background-grid {
    pointer-events: none;
    z-index: 0;
    position: absolute;
    inset: 0;

    background-image:
      linear-gradient(var(--grid-color) 1px, transparent 1px),
      linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
    background-size: 100px 100px;
  }

  :global(html.light) {
    --grid-color: rgba(0, 0, 0, 0.05);   /* Light mode grid */
  }

  :global(html.dark) {
    --grid-color: rgba(255, 255, 255, 0.06); /* Dark mode grid */
  }
`}</style>

    </div>

  );

}
