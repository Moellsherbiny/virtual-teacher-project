import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

function Logo() {
  const t = useTranslations("navbar");

  return (
    <Link
      href="/"
      className="flex items-center gap-2 group transition-all duration-300"
    >
      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-tr from-orange-500 to-orange-300 shadow-md group-hover:scale-105 transition-transform">
        <Image
          src="/images/logo.png"
          alt="logo"
          fill
          sizes="40px"
          className="object-contain p-1"
        />
      </div>

      <div className="flex flex-col leading-tight">
        <span className="text-base font-semibold text-gray-800 dark:text-white group-hover:text-orange-600 transition-colors">
          {t("brandName")}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 tracking-wide">
          {t("subtitle")}
        </span>
      </div>
    </Link>
  );
}

export default Logo;
