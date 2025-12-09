// app/dashboard/profile/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { User as UserIcon, Mail, BookOpen, GraduationCap, Settings, Edit } from "lucide-react";
import api from "@/lib/apiHandler";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
// Shadcn/ui components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast"; // Assuming you have toast setup

// --- USER DATA STRUCTURE ---
// Represents all data fetched for the profile
export type ProfileUser = {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  createdAt: Date;
  // Role-specific stats
  enrollmentCount?: number;
  coursesTaughtCount?: number;
};

// --- ZOD SCHEMA FOR UPDATING PROFILE ---
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  // Email is often not editable, but included here for completeness
  email: z.string().email("Invalid email address."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;


// --- MAIN PAGE COMPONENT ---
export default function ProfilePage() {
  const t = useTranslations("profile");
  const { data: session } = useSession(); // Get session for initial data/auth
  const { toast } = useToast();

  const [user, setUser] = useState<ProfileUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Initialize form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", email: "" },
    mode: "onChange",
  });

  // --- Data Fetching ---
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!session) return;

      try {
        // NOTE: This endpoint should fetch the user's details and role-specific stats
        const result = await api.get("/profile");
        const userData: ProfileUser = result.data.user;
        setUser(userData);

        // Set form defaults once data is fetched
        form.reset({
          name: userData.name || '',
          email: userData.email || '',
        });

      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, [session, form]);

  // --- Form Submission (Update Profile) ---
  const onSubmit = async (values: ProfileFormValues) => {
    try {
      // NOTE: API call to update user data
      const result = await api.put("/users/me", values);

      // Update local state and exit edit mode
      setUser(prev => ({
        ...(prev as ProfileUser),
        name: result.data.name,
        email: result.data.email
      }));
      setIsEditing(false);

      toast({
        title: t("toast.successTitle"),
        description: t("toast.successDescription"),
        variant: "default",
      });

    } catch (error) {
      console.error("Profile update failed:", error);
      toast({
        title: t("toast.errorTitle"),
        description: t("toast.errorDescription"),
        variant: "destructive",
      });
    }
  };

  // --- Render Functions ---

  const renderRoleSpecificStats = () => {
    if (!user) return null;

    let stats = [];
    let icon = null;
    let title = "";

    if (user.role === 'STUDENT') {
      icon = <GraduationCap className="h-6 w-6 text-orange-600 dark:text-orange-400" />;
      title = t("studentStats");
      stats.push({ label: t("enrolledCourses"), value: user.enrollmentCount ?? 0, icon: <BookOpen className="h-4 w-4" /> });
      // Add more student stats here...
    } else if (user.role === 'INSTRUCTOR') {
      icon = <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />;
      title = t("instructorStats");
      stats.push({ label: t("coursesTaught"), value: user.coursesTaughtCount ?? 0, icon: <BookOpen className="h-4 w-4" /> });
      // Add more instructor stats here...
    } else { // ADMIN
      icon = <Settings className="h-6 w-6 text-red-600 dark:text-red-400" />;
      title = t("adminStats");
      // Add admin specific links/stats here...
    }

    if (stats.length === 0) return null;

    return (
      <Card className="dark:bg-gray-800 shadow-lg">
        <CardHeader className="flex flex-row items-center space-x-3 dark:border-gray-700">
          {icon}
          <CardTitle className="text-xl text-blue-950 dark:text-gray-100">{title}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold text-blue-950 dark:text-gray-100 flex items-center mt-1">
                {stat.icon && <span className="me-2 text-orange-600 dark:text-orange-400">{stat.icon}</span>}
                {stat.value}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  // --- Render Skeleton ---
  if (isLoading) {
    return (
      <div className="p-8 space-y-8 min-h-screen">
        <Skeleton className="h-12 w-1/4 mb-6 bg-gray-200 dark:bg-gray-700" />
        <div className="grid lg:grid-cols-3 gap-8">
          <Skeleton className="h-[400px] lg:col-span-1 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-[400px] lg:col-span-2 bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    );
  }

  // --- Final Render ---
  return (
    <div className="p-4 md:p-8 space-y-8 min-h-screen">
      <h1 className="text-3xl font-extrabold text-blue-950 dark:text-gray-100">
        {t("header")} 
      </h1>
      <Separator />
      <div className="grid lg:grid-cols-3 gap-8">

        {/* Column 1: Profile Information Card */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-blue-950 dark:text-gray-100">{t("infoCardTitle")}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(prev => !prev)} aria-label={t("editProfile")}>
                  <Edit className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <UserIcon className="h-12 w-12 text-blue-950 dark:text-gray-100" />
                <div>
                  <p className="text-2xl font-bold text-blue-950 dark:text-gray-100">{user?.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t(`roles.${user?.role.toLowerCase()}`)}</p>
                </div>
              </div>

              <Separator className="dark:bg-gray-700 my-4" />

              <div className="space-y-3">
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Mail className="h-5 w-5 me-2 text-orange-600 dark:text-orange-400" />
                  {user?.email}
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <UserIcon className="h-5 w-5 me-2 text-orange-600 dark:text-orange-400" />
                  {t("memberSince")}: {new Date(user?.createdAt ?? Date.now()).toLocaleDateString(t("locale"))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Render Role-Specific Stats below the info card */}
          {renderRoleSpecificStats()}
        </div>

        {/* Column 2: Edit/Update Profile Form */}
        <div className="lg:col-span-2">
          <Card className="dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-blue-950 dark:text-gray-100">
                {isEditing ? t("editFormTitle") : t("settingsTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isEditing ? (
                <div className="text-gray-700 dark:text-gray-300 space-y-4">
                  <p>{t("nonEditMessage")}</p>
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="border-orange-600 text-orange-600 hover:bg-orange-50 dark:border-orange-400 dark:text-orange-400 dark:hover:bg-gray-700"
                  >
                    <Edit className="h-4 w-4 me-2" />
                    {t("editProfile")}
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    {/* Name Field */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.nameLabel")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Email Field */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.emailLabel")}</FormLabel>
                          <FormControl>
                            <Input disabled={true} className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => { setIsEditing(false); form.reset(); }} disabled={form.formState.isSubmitting}>
                        {t("form.cancel")}
                      </Button>
                      <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isDirty}>
                        {form.formState.isSubmitting ? (
                          <Loader2 className="me-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Edit className="me-2 h-4 w-4" />
                        )}
                        {t("form.save")}
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}