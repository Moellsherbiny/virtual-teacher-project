// app/admin/courses/create/page.tsx
"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/apiHandler";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const schema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CreateCourse() {
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/courses", data);
      toast.success("Course created");
      router.push("/dashboard/courses");
    } catch (err) {
      toast.error("Create failed");
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold mb-4">Create Course</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input placeholder="Title" {...register("title")} />
        <Textarea placeholder="Description" {...register("description")} />
        <Input placeholder="Image URL" {...register("imageUrl")} />

        <Button type="submit">Create</Button>
      </form>
    </div>
  );
}
