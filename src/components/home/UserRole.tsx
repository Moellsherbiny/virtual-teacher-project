import { Badge, BookOpen, GraduationCap, Shield } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Card } from "../ui/card";

export default function UserRoles() {
  const t = useTranslations("home");
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const roles = [
    {
      title: t("roles.student.title"),
      desc: t("roles.student.desc"),
      icon: <BookOpen className="w-5 h-5" />,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
    },
    {
      title: t("roles.teacher.title"),
      desc: t("roles.teacher.desc"),
      icon: <GraduationCap className="w-5 h-5" />,
      color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
    },
    {
      title: t("roles.admin.title"),
      desc: t("roles.admin.desc"),
      icon: <Shield className="w-5 h-5" />,
      color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
    }
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
             <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-orange-500 rounded-3xl blur-2xl opacity-20" />
                <Card className="relative p-0 overflow-hidden">
                  <div className="bg-slate-100 dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                     <span className="text-sm font-mono text-slate-500">dashboard.ver.com</span>
                     <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                     </div>
                  </div>
                  <div className="p-8 grid gap-4">
                     <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">S</div>
                        <div className="flex-1">
                           <div className="h-2 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                           <div className="h-2 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
                        </div>
                        <div className="text-green-500 font-bold text-sm">98%</div>
                     </div>
                     <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">T</div>
                        <div className="flex-1">
                           <div className="h-2 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                           <div className="h-2 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                        </div>
                        <Badge>Active</Badge>
                     </div>
                  </div>
                </Card>
             </div>
          </div>
          <div className={`lg:w-1/2 space-y-8 ${isRtl ? 'text-right' : 'text-left'}`}>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t("roles.title")}</h2>
            <div className="space-y-6">
              {roles.map((role, i) => (
                <div key={i} className="flex gap-4 group">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${role.color} group-hover:scale-110 transition-transform`}>
                      {role.icon}
                   </div>
                   <div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">{role.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400">{role.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};