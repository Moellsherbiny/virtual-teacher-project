"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PlusCircle, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/apiHandler";

// Shadcn/ui components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
import { toast } from "sonner";

// --- 1. Define Zod Schema for Validation ---
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters.").max(100),
  description: z.string().max(500).optional(),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

type CourseFormValues = z.infer<typeof formSchema>;

interface CreateCourseModalProps {
  onCourseCreated: () => void;
}

export function CreateCourseModal({ onCourseCreated }: CreateCourseModalProps) {
  const t = useTranslations("dashboard.CourseManagement");
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
    },
  });

  const { isSubmitting } = form.formState;

  // --- 2. Handle Form Submission ---
  const onSubmit = async (values: CourseFormValues) => {
    try {
      await api.post("/admin/course", values);

      // Success
      form.reset();
      setIsOpen(false);
      onCourseCreated(); // Trigger parent component to refresh data

    } catch (error) {
      toast.error(t("modal.error"));
      // TODO: Display an error message to the user (e.g., toast notification)
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold flex items-center"
        >
          <PlusCircle className="h-5 w-5 me-2" />
          {t("createNew")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto overflow-x-hidden dark:bg-gray-900 dark:text-gray-100">
        <DialogHeader>
          <DialogTitle className="text-blue-950 dark:text-gray-100">{t("modal.title")}</DialogTitle>
          <DialogDescription>
            {t("modal.description")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("modal.titleLabel")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("modal.titlePlaceholder")} {...field} />
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
                  <FormLabel>{t("modal.descriptionLabel")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("modal.descriptionPlaceholder")}
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
                  <FormLabel>{t("modal.imageUrlLabel")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("modal.imageUrlPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                {t("modal.cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="me-2 h-4 w-4 animate-spin" />
                ) : (
                  <PlusCircle className="me-2 h-4 w-4" />
                )}
                {t("modal.save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}