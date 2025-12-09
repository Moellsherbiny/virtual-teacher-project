"use client";

import { Menu } from "lucide-react";

export default function SidebarTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
    >
      <Menu className="w-6 h-6" />
    </button>
  );
}
