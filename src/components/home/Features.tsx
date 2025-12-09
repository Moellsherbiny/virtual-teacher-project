import { BrainCircuit, MessageSquare, Mic } from "lucide-react";
import { Card } from "../ui/card";
import { useTranslations } from "next-intl";

export default function Features() {
  const t = useTranslations('home');
 
  
  const features = [
    {
      icon: <Mic className="w-6 h-6 text-orange-500" />,
      title: t("features.voice.title"),
      desc: t("features.voice.desc")
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-blue-500" />,
      title: t("features.text.title"),
      desc: t("features.text.desc")
    },
    {
      icon: <BrainCircuit className="w-6 h-6 text-indigo-500" />,
      title: t("features.context.title"),
      desc: t("features.context.desc")
    }
  ];

  return (
    <section id="features" className="py-20 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{t("features.title")}</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">{t("features.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <Card key={i} className="p-6 hover:shadow-lg transition-shadow border-t-4 border-t-transparent hover:border-t-orange-500">
              <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">{f.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {f.desc}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};