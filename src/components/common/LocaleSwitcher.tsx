"use client";

import { useState, useTransition, useEffect } from "react";
import { changeLocale } from "@/i18n/changeLocale";
import { Button } from "../ui/button";
import { Locale } from "next-intl";
import { Languages, Check, Globe } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = {
  en: { label: "English", nativeLabel: "English" },
  ar: { label: "Arabic", nativeLabel: "عربي" },
};

export default function LocaleSwitcher({ initialLocale }: { initialLocale: Locale }) {
  const [lang, setLang] = useState<Locale>(initialLocale);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setLang(initialLocale);
  }, [initialLocale]);

  const handleChange = (newLocale: string) => {
    if (newLocale === lang) return;
    
    startTransition(async () => {
      await changeLocale(newLocale as Locale);
      setLang(newLocale as Locale);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isPending}>
        <Button
          variant="outline"
          size="sm"
          className="min-w-[100px] gap-2 relative"
        >
          {isPending ? (
            <>
              <Globe className="w-4 h-4 animate-spin" />
              <span className="text-xs">...</span>
            </>
          ) : (
            <>
              <Languages className="w-4 h-4" />
              <span className="font-medium">{lang === "en" ? "English" : "عربي"}</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align={lang === "en" ? "end" : "start"} className="w-48">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          <span>{lang === "en" ? "Choose Language" : "اختر اللغة"}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuRadioGroup value={lang} onValueChange={handleChange}>
          {Object.entries(languages).map(([code, { nativeLabel, }]) => (
            <DropdownMenuRadioItem
            
              key={code}
              value={code}
              className="cursor-pointer gap-2"
            >
              
              <span className="flex-1">{nativeLabel}</span>
              {lang === code && <Check className="w-4 h-4 text-primary" />}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}