"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Image as ImageIcon, Loader2 } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

import { CourseSchema } from "@/lib/schemas";
import { updateCourse } from "@/actions/course-actions";
import { uploadImage } from "@/actions/image-actions";
import Image from "next/image";

const FILE_FIELD_NAME = "courseImageFile";

/* ---------------------------------
   Schema
---------------------------------- */
const FormSchemaWithFile = CourseSchema.extend({
  courseImageFile: z
    .any()
    .optional()
    .refine(
      (files) => !files || files?.[0]?.type.startsWith("image/"),
      "Only image files are allowed"
    )
    .refine(
      (files) => !files || files?.[0]?.size <= 2 * 1024 * 1024,
      "Image must be less than 2MB"
    ),
});

type CourseFormValues = z.infer<typeof FormSchemaWithFile>;

interface CourseFormProps {
  initialData: {
    title: string;
    description: string | null;
    imageUrl: string | null;
  };
  courseId: string;
}

/* ---------------------------------
   Component
---------------------------------- */
export const CourseForm = ({ initialData, courseId }: CourseFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    initialData.imageUrl
  );
  const router = useRouter();

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(FormSchemaWithFile),
    defaultValues: {
      title: initialData.title,
      description: initialData.description ?? "",
      imageUrl: initialData.imageUrl ?? "",
      courseImageFile: undefined,
    },
    mode: "onChange",
  });

  const { isSubmitting, isValid } = form.formState;

  /* ---------------------------------
     Image Preview
  ---------------------------------- */
  useEffect(() => {
    const file = form.watch(FILE_FIELD_NAME)?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [form.watch(FILE_FIELD_NAME)]);

  const toggleEdit = () => {
    if (isEditing) {
      form.reset();
      setPreview(initialData.imageUrl);
    }
    setIsEditing((prev) => !prev);
  };

  /* ---------------------------------
     Submit
  ---------------------------------- */
  const onSubmit = async (values: CourseFormValues) => {
    try {
      let imageUrl = values.imageUrl;

      const file = values.courseImageFile?.[0];

      /* -------- Upload new image if exists -------- */
      if (file) {
        const uploadToast = toast.loading("Uploading image...");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "lms/course_banners");

        const uploadResult = await uploadImage(formData);

        toast.dismiss(uploadToast);

        if (!uploadResult.success) {
          toast.error(uploadResult.error);
          return;
        }

        imageUrl = uploadResult.url;
      }

      /* -------- Update Course -------- */
      const response = await updateCourse(courseId, {
        title: values.title,
        description: values.description,
        imageUrl,
      });

      if (response?.error) {
        toast.error(response.error);
        return;
      }

      toast.success("Course updated successfully");
      toggleEdit();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  /* ---------------------------------
     UI
  ---------------------------------- */
  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4 dark:bg-slate-900">
      <div className="flex items-center justify-between font-medium">
        Course Details
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? "Cancel" : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-xs text-muted-foreground">Title</p>
            <p className="font-semibold">{initialData.title}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Description</p>
            <p className="text-sm">
              {initialData.description || (
                <span className="italic text-slate-500">
                  No description provided
                </span>
              )}
            </p>
          </div>

          {initialData.imageUrl && (
            <Image
              src={initialData.imageUrl}
              alt="Course image"
              width={300}
              height={200}
              className="w-full rounded-md object-cover aspect-video"
            />
          )}
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* Preview */}
            <div className="space-y-2">
              <FormLabel>Preview</FormLabel>
              {preview ? (
                <Image
                  src={preview}
                  alt="Preview"
                  width={300}
                  height={200}
                  className="aspect-video w-full rounded-md object-cover"
                />
              ) : (
                <div className="flex h-40 items-center justify-center rounded-md border border-dashed text-muted-foreground">
                  <ImageIcon className="mr-2 h-5 w-5" />
                  No image selected
                </div>
              )}
            </div>

            {/* File */}
            <FormField
              control={form.control}
              name={FILE_FIELD_NAME}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      ref={field.ref}
                      onBlur={field.onBlur}
                      onChange={(e) =>
                        field.onChange(e.target.files)
                      }
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={!isValid || isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};
