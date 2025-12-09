"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { ChevronDown} from "lucide-react";

import { Card } from "@/components/ui/card";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import TopicExplorer from "@/components/home/TopicExplorer";
import UserRoles from "@/components/home/UserRole";
import Features from "@/components/home/Features";
export default function Page() {
  const t = useTranslations("home");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);


  const faqs = t.raw("faqs") as { question: string; answer: string }[];

  return (
    <>
      <Hero />
      <HowItWorks />
      <TopicExplorer />
      <Features />
      <UserRoles />

      {/* FAQs */ }
      < section className = "py-16 md:py-24 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-950" >
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {t("faqTitle")}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                إجابات على الأسئلة الأكثر شيوعًا
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <Card
                  key={idx}
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full text-right p-6 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <div className="flex justify-between items-center gap-4">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex-1">
                        {faq.question}
                      </h3>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform flex-shrink-0 ${expandedFaq === idx ? "rotate-180" : ""
                          }`}
                      />
                    </div>
                    {expandedFaq === idx && (
                      <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed text-right">
                        {faq.answer}
                      </p>
                    )}
                  </button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section >
    </>
  );
}