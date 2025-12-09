// app/dashboard/AdminHome.tsx

"use client";

import Link from "next/link";
import api from "@/lib/apiHandler";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react"; // Example icon

type States = {
  studentsCount: number;
  coursesCount: number;
  quizzesCount: number;
  convCount: number;
};

interface StatCardProps {
  title: string;
  count: number | undefined;
  isLoading: boolean;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, count, isLoading, icon }) => {
  return (
    // Card uses shadcn defaults, which handle light/dark.
    // We add hover effects for extra polish.
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </CardTitle>
        {/* Accent color for icon */}
        <div className="text-orange-600 dark:text-orange-400">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          // Skeleton loader for a clean loading state
          <Skeleton className="h-8 w-1/3 bg-gray-200 dark:bg-gray-700" />
        ) : (
          // Text color is primary-colored for contrast
          <div className="text-2xl font-bold text-blue-950 dark:text-gray-100">
            {count?.toLocaleString() ?? "0"}
          </div>
        )}
      </CardContent>
    </Card>
  );
};


export default function AdminHome() {
  const [states, setStates] = useState<States | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const session = useSession();
  const t = useTranslations("dashboard.AdminHome");

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const result = await api.get("/admin/states");
        setStates(result.data);
      } catch (error) {
        console.error("Error fetching states:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStates();
  }, []);

  const userName = session?.data?.user?.name || t("placeholderUser");
  const greeting = t("greeting", { name: userName });

  return (
    <div className="space-y-8 p-4 md:p-8 min-h-screen">
      
      <header className="flex justify-between items-start">
        {/* Navy Blue Header (Light Mode) / Deep Gray Header (Dark Mode) */}
        <div className="bg-blue-950 dark:bg-gray-800 p-6 rounded-lg shadow-xl text-white w-full max-w-4xl">
          <h1 className="text-3xl font-extrabold">{greeting}</h1>
          <p className="text-sm opacity-80 mt-1">{t("welcomeMessage")}</p>
        </div>
        
      </header>


      {/* Statistics Grid - Responsive layout */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("courses")}
          count={states?.coursesCount}
          isLoading={isLoading}
          icon={<User className="h-5 w-5" />} // Placeholder icon
        />
        <StatCard
          title={t("users")}
          count={states?.studentsCount}
          isLoading={isLoading}
          icon={<User className="h-5 w-5" />}
        />
        <StatCard
          title={t("quizzes")}
          count={states?.quizzesCount}
          isLoading={isLoading}
          icon={<User className="h-5 w-5" />}
        />
        <StatCard
          title={t("conversations")}
          count={states?.convCount}
          isLoading={isLoading}
          icon={<User className="h-5 w-5" />}
        />
      </div>

      {/* Action Button */}
      <div className="pt-4">
        {/* Orange Button (Light/Dark Mode) */}
        <Button 
          asChild 
          className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 transition-colors text-white text-lg font-semibold px-6 py-3"
        >
          <Link href="/dashboard/courses">{t("manageCourses")}</Link>
        </Button>
      </div>
    </div>
  );
}