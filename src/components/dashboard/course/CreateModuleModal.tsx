// app/courses/[courseId]/components/CreateModuleModal.tsx (Refactored Location)
"use client";

import React, { useState, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useForm, FieldValues } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, BookOpen } from "lucide-react";
import api from "@/lib/apiHandler";

// Shadcn/ui components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// ====================================================================
// 1. ZOD SCHEMA FIX: Combined into a single object
// ====================================================================

const moduleFormSchema = (t: (key: string) => string) =>
  z.object({
    title: z.string().min(1, {
      message: t("validation.required"),
    }).max(100, {
      message: t("validation.maxLength"), // Added length placeholder
    }),
    // Ensure 'order' is validated as a number
    order: z.coerce.number({
      required_error: t("validation.required"),
      invalid_type_error: t("validation.mustBeNumber"),
    }).min(0, {
      message: t("validation.minOrder"), // Assuming a min order of 0
    }),
  });

// Define the inferred type from the schema for strong typing
type ModuleFormValues = z.infer<ReturnType<typeof moduleFormSchema>>;

// ====================================================================
// 2. COMPONENT PROPS
// ====================================================================

interface CreateModuleModalProps {
  courseId: string;
  isOpen: boolean;
  onClose: () => void;
  onModuleCreated: () => void; // Function to refresh the module list
}

// ====================================================================
// 3. MAIN COMPONENT
// ====================================================================

export const CreateModuleModal: React.FC<CreateModuleModalProps> = ({
  courseId,
  isOpen,
  onClose,
  onModuleCreated,
}) => {
  const t = useTranslations("dashboard.CreateModule");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentLocale = useLocale(); 
  const isRTL = currentLocale === 'ar';

  // Use useMemo for the form schema to prevent unnecessary re-creation
  const schema = useMemo(() => moduleFormSchema(t), [t]);

  // Initialize the form
  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      order: 0, // Defaulting to 0 is common for initial placement
    },
  });

  const { reset } = form;

  // ====================================================================
  // 4. SUBMISSION HANDLER & ERROR HANDLING
  // ====================================================================

  const onSubmit = async (values: ModuleFormValues) => {
    setIsSubmitting(true);
    try {
      // Ensure 'order' is sent as an integer
      const payload = { ...values, order: Number(values.order) };

      await api.post(`/admin/course/${courseId}/module`, payload);

      toast({
        title: t("toast.successTitle"),
        description: t("toast.successDescription", { title: values.title }),
      });

      reset();
      onModuleCreated(); // Refresh the list
      onClose();

    } catch (error) {
      console.error("Error creating module:", error);

      // Handle specific API error responses here if possible (e.g., error.response.data.message)
      const errorMessage = (error as any)?.response?.data?.message || t("toast.errorMessage");

      toast({
        title: t("toast.errorTitle"),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset(); // Clear form when modal closes
    onClose();
  }

  // ====================================================================
  // 5. RENDER LOGIC (RTL/LRT HANDLING)
  // ====================================================================

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      {/* Set text direction based on locale */}
      <DialogContent className={`sm:max-w-[425px] ${isRTL ? 'text-right' : 'text-left'}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <BookOpen className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t("title")}
          </DialogTitle>
          <DialogDescription>
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">

            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className={isRTL ? 'text-right' : 'text-left'}>
                  <FormLabel>{t("form.titleLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.titlePlaceholder")}
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Order Field (Fixed to handle number input and correct labels) */}
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem className={isRTL ? 'text-right' : 'text-left'}>
                  <FormLabel>{t("form.orderLabel")}</FormLabel> {/* Corrected label */}
                  <FormControl>
                    <Input
                      type="number" // Use type="number" for order
                      placeholder={t("form.orderPlaceholder")} // Corrected placeholder
                      {...field}
                      // Zod's coerce handles conversion, but the input value must be treated as string for React
                      value={field.value.toString()}
                      onChange={e => field.onChange(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className={`pt-4 ${isRTL ? 'justify-start' : 'justify-end'}`}>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                {t("form.cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className={`h-4 w-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t("form.creating")}
                  </>
                ) : (
                  t("form.createModule")
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

// ====================================================================
// 6. RECOMMENDED TRANSLATION KEYS (for your i18n file)
// ====================================================================

// You'll need these new keys in your JSON translation file:
/*
"dashboard": {
    "CreateModule": {
        "title": "Create New Module",
        "description": "Add a new module to the course to organize lessons.",
        "form": {
            "titleLabel": "Module Title",
            "titlePlaceholder": "e.g., Introduction to JavaScript",
            "orderLabel": "Module Order", // NEW
            "orderPlaceholder": "e.g., 1 or 10", // NEW
            "cancel": "Cancel",
            "creating": "Creating...",
            "createModule": "Create Module"
        },
        "toast": {
            "successTitle": "Module Created!",
            "successDescription": "Module \"{title}\" has been successfully added.",
            "errorTitle": "Creation Failed",
            "errorMessage": "Failed to create the module. Please try again."
        },
        "validation": {
            "required": "This field is required.",
            "maxLength": "Must be less than {length} characters.",
            "mustBeNumber": "Order must be a number.", // NEW
            "minOrder": "Order must be 0 or greater." // NEW
        }
    }
}
*/