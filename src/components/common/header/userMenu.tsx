"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { LogOut, User as UserIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// --- NEXT-INTL IMPLEMENTATION ---
import { useTranslations } from "next-intl"; 
// Note: Ensure your environment is configured for `next-intl`

interface UserMenuProps {
  user: {
    name: string;
    image: string;
    email?: string; 
  };
}

export default function UserMenu({ user }: UserMenuProps) {
  // Initialize translations for the 'UserMenu' scope
  const t = useTranslations("dashboard.userMenu"); 
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      redirect: false,
    });
    // Redirect to the home page (or localized login page)
    router.push("/"); 
  };

  // Get initials for AvatarFallback
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
    
  // Determine direction based on locale. 
  // 'next-intl' usually provides the locale, but we can hardcode 'rtl' if we know the language is Arabic
  const direction = t('dir') === 'rtl' ? 'rtl' : 'ltr';

  return (
    // Set direction dynamically
    <DropdownMenu dir={direction}> 
      <DropdownMenuTrigger asChild>
        <button
          aria-label={t("ariaLabel")} // Translated accessibility label
          className="rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary outline-none transition-shadow"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      
      {/* Align to the end for standard navigation bar placement */}
      <DropdownMenuContent align="end" className="w-56">
        
        {/* User Information Header */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            {user.email && (
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />

        {/* Profile Link */}
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile" className="cursor-pointer flex items-center">
            <UserIcon className={direction === 'rtl' ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
            <span>{t("profile")}</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Sign Out Action */}
        <DropdownMenuItem 
          onClick={handleLogout}
          className="text-red-600 hover:text-red-700 focus:text-red-700 focus:bg-red-50/50 cursor-pointer flex items-center"
        >
          <LogOut className={direction === 'rtl' ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
          <span>{t("signOut")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}