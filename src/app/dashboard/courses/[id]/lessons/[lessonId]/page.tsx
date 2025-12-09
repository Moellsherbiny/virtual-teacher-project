"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Lesson, LessonType } from "@/types/course";
import api from "@/lib/apiHandler";

export default function EditLessonPage() {
  const { courseId, lessonId } = useParams();
  const router = useRouter();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<LessonType>(LessonType.VIDEO);
  const [isPublished, setIsPublished] = useState(false);

  // Load lesson data
  useEffect(() => {
    async function loadLesson() {
      try {
        const res = await api.get(`/admin/course/${courseId}/lesson/${lessonId}`);
        const data = res.data.lesson;
        setLesson(data);
        setTitle(data.title);
        setContent(data.content || "");
        setType(data.type);
        setIsPublished(data.isPublished);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load lesson");
        router.push(`/admin/courses/${courseId}`);
      }
    }

    if (courseId && lessonId) loadLesson();
  }, [courseId, lessonId]);

  const handleSave = async () => {
    try {
      console.log("Update Lesson:", { id: lessonId, title, content, type, isPublished });
      toast.success("Lesson updated (simulated)");
      // TODO: replace with actual API call
    } catch {
      toast.error("Update failed");
    }
  };

  if (!lesson) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto space-y-4 p-4">
      <h1 className="text-2xl font-bold">Edit Lesson</h1>
      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Lesson Title" />
      <Select onValueChange={(val) => setType(val as LessonType)} value={type}>
        <SelectTrigger>
          <SelectValue placeholder="Select Lesson Type" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(LessonType).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
        </SelectContent>
      </Select>
      <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Lesson Content" />
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
        />
        <label>Published</label>
      </div>
      <Button onClick={handleSave}>Save</Button>
    </div>
  );
}
