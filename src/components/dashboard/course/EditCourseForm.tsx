// components/dashboard/EditCourseForm.tsx

"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import api from "@/lib/apiHandler";
import { Course } from "@/types/course"; 

// Shadcn/ui components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// --- Zod Schema for Validation ---
const formSchema = (t: (key: string) => string) =>
  z.object({
    title: z.string().min(3, {
      message: t("validation.titleMin"), 
    }),
    description: z.string().optional(),
    imageUrl: z.string().url().or(z.literal("")).optional(), 
  });

// --- Component Props Type ---
interface EditCourseFormProps {
  course: Course;
  onCourseUpdated: () => void; 
}

export const EditCourseForm: React.FC<EditCourseFormProps> = ({
  course,
  onCourseUpdated,
}) => {
  const t = useTranslations("dashboard.EditCoursePage");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form with current course data
  const form = useForm<z.infer<ReturnType<typeof formSchema>>>({
    resolver: zodResolver(formSchema(t)),
    defaultValues: {
      title: course.title || "",
      description: course.description || "",
      imageUrl: course.imageUrl || "",
    },
  });

  // --- Form Submission Handler ---
  const onSubmit = async (values: z.infer<ReturnType<typeof formSchema>>) => {
    setIsSubmitting(true);
    try {
      // API call to update the course
      await api.patch(`/admin/course/${course.id}`, values);

      toast({
        title: t("toast.successTitle"), 
        description: t("toast.successDescription", { title: values.title }),
      });
      
      onCourseUpdated(); // Triggers the parent component to re-fetch the data
      
    } catch (error) {
      console.error("Error updating course:", error);
      toast({
        title: t("toast.errorTitle"), 
        description: t("toast.errorMessage"), 
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.titleLabel")}</FormLabel>
              <FormControl>
                <Input placeholder={t("form.titlePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.descriptionLabel")}</FormLabel>
              <FormControl>
                <Textarea 
                    placeholder={t("form.descriptionPlaceholder")} 
                    {...field} 
                    rows={4} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image URL Field */}
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.imageUrlLabel")}</FormLabel>
              <FormControl>
                <Input 
                    placeholder={t("form.imageUrlPlaceholder")} 
                    {...field}
                    value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="pt-2">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("form.saving")}
              </>
            ) : (
              t("form.saveChanges")
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};