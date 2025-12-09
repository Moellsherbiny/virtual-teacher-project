// src/components/course/module/ManageModuleDialog.tsx
"use client";

import { FC, useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, BookOpen, Upload, Edit3 } from "lucide-react";
import api from "@/lib/apiHandler";
import { Module } from "@/types/course";
import { useToast } from "@/components/ui/use-toast";

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
import { Checkbox } from "@/components/ui/checkbox";

// --- Zod Schema for Validation (Needs translation function 't') ---
const moduleFormSchema = (t: any) =>
  z.object({
    title: z.string().min(1, { message: t("validation.required") }).max(100, { message: t("validation.maxLength", { length: 100 }) }),
    order: z.coerce.number({
      invalid_type_error: t("validation.mustBeNumber"),
    }).min(0, { message: t("validation.minOrder") }),
    isPublished: z.boolean(),
    courseId: z.string().min(1), // Required to know where to create/update
  });

type ModuleFormValues = z.infer<ReturnType<typeof moduleFormSchema>>;

// --- Component Props Type ---
interface ManageModuleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (module: Module) => void; // Callback to notify parent (e.g., refresh list)
  module?: Module; // Optional: If present, we are editing
  courseId: string; // Required for creation
  t: any; // i18n translation function
}

export const ManageModuleDialog: FC<ManageModuleDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  module,
  courseId,
  t
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!module;
  const schema = useMemo(() => moduleFormSchema(t), [t]);

  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: module?.title || "",
      order: module?.order || 0,
      isPublished: module?.isPublished || false,
      courseId: courseId,
    },
  });

  // Reset form when the dialog opens or the module object changes (for edits)
  useEffect(() => {
    if (isOpen) {
      form.reset({
        title: module?.title || "",
        order: module?.order || 0,
        isPublished: module?.isPublished || false,
        courseId: courseId,
      });
    }
  }, [isOpen, module, courseId, form]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmitHandler = async (values: ModuleFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        order: Number(values.order),
      };

      let response;

      if (isEditing && module) {
        // UPDATE MODULE: PATCH /admin/module/:moduleId
        response = await api.patch(`/admin/module/${module.id}`, payload);
      } else {
        // CREATE MODULE: POST /admin/course/:courseId/module
        response = await api.post(`/admin/course/${courseId}/module`, payload);
      }

      // Assume the API returns the updated/created module object
      onSubmit(response.data.module);

      toast({
        title: isEditing ? t("toast.editSuccessTitle") : t("toast.createSuccessTitle"),
        description: t("toast.successDescription", { title: values.title }),
      });

      handleClose();

    } catch (error) {
      console.error("Error managing module:", error);
      const errorMessage = (error as any)?.response?.data?.message || t("toast.apiErrorFallback");

      toast({
        title: t("toast.errorTitle"),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {isEditing ? <Edit3 className="w-5 h-5 mr-2" /> : <BookOpen className="w-5 h-5 mr-2" />}
            {isEditing ? t("dialogs.editModuleTitle") : t("dialogs.createModuleTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("dialogs.moduleDescription")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-4 py-2">

            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.titleLabel")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("form.titlePlaceholder")} {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Order Field */}
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.orderLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      value={field.value.toString()}
                      onChange={e => field.onChange(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Publish Checkbox */}
            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 border rounded-md">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t("form.publishLabel")}</FormLabel>
                    <DialogDescription>{t("form.publishDescription")}</DialogDescription>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                {t("buttons.cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("buttons.saving")}
                  </>
                ) : (
                  t("buttons.saveChanges")
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};