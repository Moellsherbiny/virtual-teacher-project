"use client";
import UserMenu from "@/components/common/header/userMenu";
import { useLocale } from "next-intl";
import Logo from "../Logo";

interface User {
  user: { name: string; image: string };
}

export default function Header({ user }: User) {
  const locale = useLocale();
  
  return (
    <header
      className="py-2"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Logo/>  
          <UserMenu
            user={{
              name: user.name,
              image: user.image,
            }}
          />
      
      </div>
    </header>
  );
}
