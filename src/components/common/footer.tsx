import { useTranslations } from "next-intl";
import Logo from "./Logo"
import NavLinks from "./NavLinks";

export default function Footer() {
  const t = useTranslations('footer');
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Logo />
          
        <NavLinks className="flex-col md:flex-row" />

          <p className="text-sm text-slate-400">
            {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
};