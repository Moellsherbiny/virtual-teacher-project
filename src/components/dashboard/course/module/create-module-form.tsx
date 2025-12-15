"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ModuleSchema } from "@/lib/schemas";
import { createModule } from "@/actions/module-actions";

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

interface CreateModuleFormProps {
  courseId: string;
}

type ModuleFormValues = z.infer<typeof ModuleSchema>;

export function CreateModuleForm({ courseId }: CreateModuleFormProps) {
  const router = useRouter();

  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(ModuleSchema),
    defaultValues: {
      title: "",
    },
    mode: "onChange",
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: ModuleFormValues) => {
    try {
      const response = await createModule(courseId, values);

      if (response?.error) {
        toast.error(response.error);
        return;
      }

      toast.success("Module created successfully");
      router.push(`/dashboard/courses/${courseId}`);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 rounded-md border bg-slate-100 p-6 dark:bg-slate-900"
      >
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Module Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Introduction"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
          >
            Create Module
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
