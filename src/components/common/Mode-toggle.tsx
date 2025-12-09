"use client";

import { Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative gap-2 min-w-[100px] overflow-hidden group"
        >
          {/* Animated Background */}
          <div
            className={`absolute inset-0 transition-all duration-500 ${
              isDark
                ? "bg-gradient-to-r from-slate-800 to-slate-900"
                : "bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-slate-800 dark:to-slate-900"
            }`}
          ></div>

          {/* Animated Glow */}
          <div
            className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
              isDark ? "bg-blue-500/10" : "bg-orange-500/10"
            }`}
          ></div>

          {/* Icon with Animation */}
          <div className="relative z-10 flex items-center gap-2">
            {isDark ? (
              <Moon className="w-4 h-4 text-blue-400 animate-pulse" />
            ) : (
              <Sun className="w-4 h-4 text-orange-500 animate-spin-slow" />
            )}
            <span className="text-sm font-medium">
              {isDark ? "Dark" : "Light"}
            </span>
          </div>

          {/* Sparkle Effect */}
          <Sparkles className="w-3 h-3 absolute top-1 right-1 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>Theme</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="cursor-pointer gap-2"
        >
          <Sun className="w-4 h-4 text-orange-500" />
          <span>Light</span>
          {theme === "light" && (
            <div className="ml-auto w-2 h-2 rounded-full bg-orange-500"></div>
          )}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="cursor-pointer gap-2"
        >
          <Moon className="w-4 h-4 text-blue-400" />
          <span>Dark</span>
          {theme === "dark" && (
            <div className="ml-auto w-2 h-2 rounded-full bg-blue-400"></div>
          )}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="cursor-pointer gap-2"
        >
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span>System</span>
          {theme === "system" && (
            <div className="ml-auto w-2 h-2 rounded-full bg-purple-500"></div>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>

      <style jsx global>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </DropdownMenu>
  );
}

// Alternative: Simple Toggle Version (Backup)
export function ModeToggleSimple() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative flex items-center justify-center w-16 h-8 rounded-full 
      transition-all duration-500 active:scale-95 shadow-lg hover:shadow-xl
      ${
        isDark
          ? "bg-gradient-to-r from-slate-800 via-slate-900 to-blue-900"
          : "bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500"
      }`}
      aria-label="Toggle theme"
    >
      {/* Sliding ball with improved animation */}
      <div
        className={`absolute top-1 w-6 h-6 rounded-full flex items-center justify-center
        bg-white dark:bg-slate-700 shadow-lg transform transition-all duration-500 ease-out
        ${isDark ? "left-9" : "left-1"}
        hover:scale-110`}
      >
        {isDark ? (
          <Moon className="w-4 h-4 text-blue-400 transition-transform duration-300 animate-pulse" />
        ) : (
          <Sun className="w-4 h-4 text-orange-500 transition-transform duration-300 animate-spin-slow" />
        )}
      </div>

      {/* Background Stars/Sun Rays */}
      <div className="absolute inset-0 overflow-hidden rounded-full">
        {isDark ? (
          <>
            <div className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full animate-pulse"></div>
            <div className="absolute top-4 left-4 w-1 h-1 bg-white rounded-full animate-pulse delay-100"></div>
            <div className="absolute top-3 left-6 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-200"></div>
          </>
        ) : (
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-radial from-yellow-200 to-transparent"></div>
          </div>
        )}
      </div>

      {/* Glow effect */}
      <div
        className={`absolute inset-0 rounded-full blur-md transition-all duration-500 -z-10
        ${isDark ? "bg-blue-500/20" : "bg-orange-500/30"}`}
      ></div>

      <span className="sr-only">Toggle theme</span>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </button>
  );
}