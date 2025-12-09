import { History, ArrowRight, Calculator, FlaskConical, Languages, Palette, Terminal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "../ui/button";

export default function TopicExplorer() {
  const t = useTranslations('home');
  const locale = useLocale();
  

  const topics = [
    { name: t("subjects.math"), icon: <Calculator className="w-6 h-6" />, color: "bg-red-500" },
    { name: t("subjects.science"), icon: <FlaskConical className="w-6 h-6" />, color: "bg-green-500" },
    { name: t("subjects.lang"), icon: <Languages className="w-6 h-6" />, color: "bg-blue-500" },
    { name: t("subjects.code"), icon: <Terminal className="w-6 h-6" />, color: "bg-slate-800" },
    { name: t("subjects.history"), icon: <History className="w-6 h-6" />, color: "bg-yellow-600" },
    { name: t("subjects.arts"), icon: <Palette className="w-6 h-6" />, color: "bg-purple-500" },
  ];

  return (
    <section id="subjects" className="py-20 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{t("subjects.title")}</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">{t("subjects.subtitle")}</p>
          </div>
          <Button variant="outline" className="shrink-0">
             {t("nav.subjects")} <ArrowRight className={`w-4 h-4 ${locale === 'ar' ? 'mr-2 rotate-180' : 'ml-2'}`} />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {topics.map((topic, i) => (
            <button key={i} className="group flex flex-col items-center justify-center p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-orange-500 dark:hover:border-orange-500 hover:shadow-lg transition-all bg-slate-50 dark:bg-slate-900/50">
              <div className={`w-12 h-12 rounded-full ${topic.color} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {topic.icon}
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">{topic.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
