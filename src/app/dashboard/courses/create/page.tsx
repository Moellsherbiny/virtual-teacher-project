"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, CloudUpload } from "lucide-react";

import { uploadImage } from "@/actions/image-actions";
import { createCourse } from "@/actions/course-actions";
import { CourseSchema } from "@/lib/schemas";

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

/* ---------------------------------
   Schema
---------------------------------- */
const FILE_FIELD_NAME = "courseImageFile";

const FormSchemaWithFile = CourseSchema.extend({
  courseImageFile: z
    .any()
    .refine((files) => files?.length === 1, "Course image is required")
    .refine(
      (files) => files?.[0]?.type.startsWith("image/"),
      "Only image files are allowed"
    )
    .refine(
      (files) => files?.[0]?.size <= 2 * 1024 * 1024,
      "Image must be less than 2MB"
    ),
});

type CourseFormValues = z.infer<typeof FormSchemaWithFile>;

/* ---------------------------------
   Component
---------------------------------- */
export default function CreateCoursePage() {
  const router = useRouter();

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(FormSchemaWithFile),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      courseImageFile: undefined,
    },
    mode: "onChange",
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: CourseFormValues) => {
    const file = values.courseImageFile?.[0];

    if (!file) {
      toast.error("Please select an image");
      return;
    }

    try {
      /* ----------------------------
         Upload Image
      ----------------------------- */
      const uploadToast = toast.loading("Uploading image...");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "lms/course_banners");

      const uploadResult = await uploadImage(formData);

      if (!uploadResult.success) {
        toast.dismiss(uploadToast);
        toast.error(uploadResult.error);
        return;
      }

      toast.dismiss(uploadToast);

      /* ----------------------------
         Create Course
      ----------------------------- */
      const response = await createCourse({
        title: values.title,
        description: values.description,
        imageUrl: uploadResult.url, // ✅ CORRECT
        // optional future-proof:
        // imagePublicId: uploadResult.publicId
      });

      if (response?.error) {
        toast.error(response.error);
        return;
      }

      toast.success("Course created successfully");
      router.push(`/dashboard/courses/${response.id}`);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mx-auto flex h-full max-w-5xl items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <h1 className="text-2xl font-semibold">Name your course</h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-6"
          >
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Advanced Web Development"
                      disabled={isSubmitting}
                      {...field}
                    />
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
                  <FormLabel>Course Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Course description"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image */}
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
                      onChange={(e) => field.onChange(e.target.files)}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading & Saving...
                </>
              ) : (
                <>
                  <CloudUpload className="mr-2 h-4 w-4" />
                  Continue
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
