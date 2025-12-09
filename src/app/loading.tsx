"use client";
import { Brain } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
      <div className="text-center space-y-6" dir="rtl">

        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-blue-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}