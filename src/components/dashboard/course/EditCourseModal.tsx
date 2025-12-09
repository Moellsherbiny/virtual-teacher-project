"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Edit } from "lucide-react";
import api from "@/lib/apiHandler"; // Your existing API handler
import { Course } from "@/types/course"; 

// Shadcn/ui components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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

// --- 1. Zod Schema for Validation ---
const formSchema = (t: (key: string) => string) =>
  z.object({
    title: z.string().min(3, {
      message: t("validation.titleMin"), // e.g., "Title must be at least 3 characters."
    }),
    description: z.string().optional(),
    imageUrl: z.string().url().or(z.literal("")).optional(), // Allow empty string or a valid URL
    // You might add instructorId here later
  });

// --- 2. Component Props Type ---
interface EditCourseModalProps {
  courseId: string | null; // ID of the course to edit, null when closed
  isOpen: boolean;
  onClose: () => void;
  onCourseUpdated: () => void; // Function to refresh the course list
}

export const EditCourseModal: React.FC<EditCourseModalProps> = ({
  courseId,
  isOpen,
  onClose,
  onCourseUpdated,
}) => {
  const t = useTranslations("dashboard.EditCourse");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<Course | null>(null);

  // Initialize the form with zod resolver
  const form = useForm<z.infer<ReturnType<typeof formSchema>>>({
    resolver: zodResolver(formSchema(t)),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
    },
  });
  
  const { reset } = form;

  // --- 3. Fetch Data Effect ---
  useEffect(() => {
    if (courseId && isOpen) {
      const fetchCourse = async () => {
        try {
          // Replace with your actual endpoint to fetch a single course
          const result = await api.get(`/admin/course/${courseId}`);
          const course = result.data.course;

          setInitialData(course);
          
          // Set form values after fetching
          reset({
            title: course.title || "",
            description: course.description || "",
            imageUrl: course.imageUrl || "",
          });
          
        } catch (error) {
          console.error("Error fetching course for edit:", error);
          toast({
            title: t("toast.fetchError"), // e.g., "Error fetching course details."
            variant: "destructive",
          });
          onClose();
        }
      };
      fetchCourse();
    } else if (!isOpen) {
        // Reset form state when modal closes
        setInitialData(null);
        reset();
    }
  }, [courseId, isOpen, reset, toast, t, onClose]);


  // --- 4. Form Submission Handler ---
  const onSubmit = async (values: z.infer<ReturnType<typeof formSchema>>) => {
    if (!courseId) return;

    setIsSubmitting(true);
    try {
      // API call to update the course
      await api.patch(`/admin/course/${courseId}`, values);

      toast({
        title: t("toast.successTitle"), // e.g., "Course Updated!"
        description: t("toast.successDescription", { title: values.title }), // e.g., "The course 'React Basics' has been updated."
      });
      
      onCourseUpdated(); // Refresh the list
      onClose(); // Close the modal

    } catch (error) {
      console.error("Error updating course:", error);
      toast({
        title: t("toast.errorTitle"), // e.g., "Update Failed"
        description: t("toast.errorMessage"), // e.g., "There was an error updating the course. Please try again."
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Edit className="w-5 h-5 mr-2" />
            {t("title")} {/* e.g., "Edit Course" */}
          </DialogTitle>
          <DialogDescription>
            {t("description")} {/* e.g., "Make changes to the course details here. Click save when you're done." */}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            
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
                        rows={3} 
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
                        // Ensure input is empty string if null/undefined for controlled component
                        value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="pt-4">
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
      </DialogContent>
    </Dialog>
  );
};