"use client";

import { FC, useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Video, FileText, BookOpen } from "lucide-react";
import api from "@/lib/apiHandler";
import { Lesson, Module } from "@/types/course"; // Import Lesson/Module types
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

// --- Zod Schema for Validation (Needs translation function 't') ---
const lessonFormSchema = (t: any) =>
  z.object({
    title: z.string().min(1, { message: t("validation.required") }).max(150, { message: t("validation.maxLength", { length: 150 }) }),
    order: z.coerce.number({
      invalid_type_error: t("validation.mustBeNumber"),
    }).min(0, { message: t("validation.minOrder") }),
    content: z.string().optional(),
    videoUrl: z.string().url({ message: t("validation.invalidUrl") }).optional().or(z.literal('')),
    isPublished: z.boolean(),
    moduleId: z.string().optional(), // Used for creation context if needed
  });

type LessonFormValues = z.infer<ReturnType<typeof lessonFormSchema>>;

// --- Component Props Type ---
interface ManageLessonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (lesson: Lesson) => void; // Callback to notify parent (e.g., refresh list)
  lesson?: Lesson; // Optional: If present, we are editing
  moduleId: string; // Required for lesson creation
  t: any; // i18n translation function
}

export const ManageLessonDialog: FC<ManageLessonDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  lesson,
  moduleId,
  t
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!lesson;
  const schema = useMemo(() => lessonFormSchema(t), [t]);

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: lesson?.title || "",
      order: lesson?.order || 0,
      content: lesson?.content || "",
      videoUrl: lesson?.videoUrl || "",
      isPublished: lesson?.isPublished || false,
      moduleId: moduleId,
    },
  });

  // Reset form when the dialog opens or the lesson object changes (for edits)
  useEffect(() => {
    if (isOpen) {
      form.reset({
        title: lesson?.title || "",
        order: lesson?.order || 0,
        content: lesson?.content || "",
        videoUrl: lesson?.videoUrl || "",
        isPublished: lesson?.isPublished || false,
        moduleId: moduleId,
      });
    }
  }, [isOpen, lesson, moduleId, form]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmitHandler = async (values: LessonFormValues) => {
    setIsSubmitting(true);
    try {
      // Clean up optional fields if they are empty strings
      const payload = {
        ...values,
        content: values.content || null,
        videoUrl: values.videoUrl || null,
        order: Number(values.order),
        moduleId: moduleId,
      };

      let response;

      if (isEditing && lesson) {
        // UPDATE LESSON
        response = await api.patch(`/admin/lesson/${lesson.id}`, payload);
      } else {
        // CREATE LESSON
        response = await api.post(`/admin/module/${moduleId}/lesson`, payload);
      }

      // Notify the parent component of the change
      onSubmit(response.data.lesson);

      toast({
        title: isEditing ? t("toast.editSuccessTitle") : t("toast.createSuccessTitle"),
        description: t("toast.successDescription", { title: values.title }),
      });

      handleClose();

    } catch (error) {
      console.error("Error managing lesson:", error);
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            {isEditing ? t("dialogs.editLessonTitle") : t("dialogs.createLessonTitle")}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? t("dialogs.editLessonDescription") : t("dialogs.createLessonDescription", { moduleId })}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-4 py-2">

            {/* Title and Order */}
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>{t("form.titleLabel")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("form.titlePlaceholder")} {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            </div>

            {/* Video URL */}
            <FormField
              control={form.control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Video className="w-4 h-4 mr-2" />
                    {t("form.videoUrlLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={t("form.videoUrlPlaceholder")} {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Text Content */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    {t("form.contentLabel")}
                  </FormLabel>
                  <FormControl>
                    <Textarea rows={6} placeholder={t("form.contentPlaceholder")} {...field} disabled={isSubmitting} />
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