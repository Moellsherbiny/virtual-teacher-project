import { Badge, Fingerprint, LineChart, MessageSquare, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

export default function HowItWorks() {
  const t = useTranslations('home');
  
const steps = [
    {
      icon: <Fingerprint className="w-6 h-6" />,
      title: t("howItWorks.steps.0.title"),
      desc: t("howItWorks.steps.0.desc"),
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: t("howItWorks.steps.1.title"),
      desc: t("howItWorks.steps.1.desc"),
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: t("howItWorks.steps.2.title"),
      desc: t("howItWorks.steps.2.desc"),
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      title: t("howItWorks.steps.3.title"),
      desc: t("howItWorks.steps.3.desc"),
    },
  ];


  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-200 border-orange-200 dark:border-orange-800">
            {t("howItWorks.title")}
          </Badge>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{t("howItWorks.title")}</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">{t("howItWorks.subtitle")}</p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-800 to-transparent z-0" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-900 border-4 border-slate-50 dark:border-slate-800 shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative">
                  <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};