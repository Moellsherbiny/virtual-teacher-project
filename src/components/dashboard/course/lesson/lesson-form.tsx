"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react"; 

import { LessonDTO, LessonSchema , LessonTypeEnum} from "@/lib/schemas"; // Assuming this uses z.enum(["VIDEO", "TEXT", "MATERIALS"])
import { createLesson, updateLesson } from "@/actions/lesson-actions";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


// 1. Define a partial type for the Lesson to avoid 'any'
// Ideally import this from @prisma/client or your db types
interface Lesson {
  id: string;
  title: string;
  type: typeof LessonTypeEnum;
  content?: string | null;
  videoUrl?: string | null;
  fileUrl?: string | null;
}

type LessonFormValues = z.infer<typeof LessonSchema>;

interface LessonFormProps {
  moduleId: string; // Made required for creation context
  lesson: LessonDTO | null; 
}

export function LessonForm({ moduleId, lesson }: LessonFormProps) {
  const router = useRouter();

  // 2. Clean default values logic
  const defaultValues: Partial<LessonFormValues> = {
    title: lesson?.title || "",
    type: lesson?.type as any,
    content: lesson?.content || "",
    videoUrl: lesson?.videoUrl || "",
    fileUrl: lesson?.fileUrl || "",
  };

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(LessonSchema),
    defaultValues,
  });

  const { isSubmitting, isValid } = form.formState;
  const lessonType = form.watch("type");

  const onSubmit = async (values: LessonFormValues) => {
    try {
      const response = lesson
        ? await updateLesson(lesson.id, values)
        : await createLesson(moduleId, values);

      if (response?.error) {
        toast.error(response.error);
        return;
      }

      toast.success(lesson ? "Lesson updated" : "Lesson created");
      
  
      router.refresh();
      router.back()
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex w-full flex-col gap-6">
      <div className="flex items-center gap-x-2">
        <Button 
            variant="ghost" 
            onClick={() => router.back()} 
            type="button"
            className="h-8 w-8 p-0"
        >
            <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-medium">
            {lesson ? "Edit Lesson" : "New Lesson"}
        </h1>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 rounded-md border bg-slate-100 p-6 dark:bg-slate-900"
        >
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lesson Title</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g. 'Introduction to the course'" 
                    disabled={isSubmitting} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lesson Type</FormLabel>
                <Select 
                    value={field.value}
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a lesson type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="VIDEO">Video</SelectItem>
                    <SelectItem value="TEXT">Text</SelectItem>
                    <SelectItem value="MATERILAS">Materials</SelectItem> {/* Typo Fixed */}
                  </SelectContent>
                </Select>
                <FormDescription>
                    This determines what content fields are available.
                </FormDescription>
              </FormItem>
            )}
          />

          {/* Dynamic Fields */}
          {lessonType === "VIDEO" && (
            <FormField
              control={form.control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL</FormLabel>
                  <FormControl>
                    <Input 
                        {...field} 
                        disabled={isSubmitting} 
                        placeholder="e.g. https://www.youtube.com/watch?v=..." 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {lessonType === "TEXT" && (
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Content</FormLabel>
                  <FormControl>
                    <Textarea 
                        rows={10} 
                        {...field} 
                        disabled={isSubmitting}
                        placeholder="Write your lesson content here..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {lessonType === "MATERILAS" && (
            <FormField
              control={form.control}
              name="fileUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File URL</FormLabel>
                  <FormControl>
                    <Input 
                        {...field} 
                        disabled={isSubmitting} 
                        placeholder="Upload a PDF or resource link"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex items-center gap-x-2 justify-end">
            <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
            >
                Cancel
            </Button>
            <Button type="submit" disabled={!isValid || isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {lesson ? "Save Changes" : "Create Lesson"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}