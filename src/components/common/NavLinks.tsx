import { useTranslations } from "next-intl";
import Link from "next/link";

// Define the type for a single navigation link
type NavLink = {
  href: string;
  label: string;
};

export default function Navbar({className}: {className?: string;}) {
  const t = useTranslations("navbar");

    const links: NavLink[] = [
      { href: "/", label: t("home") },
      { href: "/#how-it-works", label: t("howItWorks") },
      { href: "/#features", label: t("features") },
      { href: "/#subjects", label: t("subjects") },
      { href: "/about", label: t("about") },
      { href: "/contact", label: t("contact") },
      { href: "/courses", label: t("courses") },
    ];

  return (

    <nav aria-label={t("mainNavigation")}>
      <ul
        className={`flex items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-300 ${className}`}
      >
        {links.map((link) => (
          <li key={link.href}>
            <Link
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              href={link.href}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}