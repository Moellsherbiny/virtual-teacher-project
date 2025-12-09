"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import api from "@/lib/apiHandler";
import { toast } from "sonner";

interface CourseEditorProps {
  id: string;
  initialTitle: string;
  initialDescription?: string;
  onUpdated?: () => void;
}

export default function CourseEditor({
  id,
  initialTitle,
  initialDescription = "",
  onUpdated,
}: CourseEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [loading, setLoading] = useState(false);

  const update = async () => {
    setLoading(true);
    try {
      await api.patch(`/admin/courses/${id}`, { title, description });
      toast.success("Updated");
      onUpdated?.();
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded max-w-2xl space-y-2">
      <h3 className="font-semibold">Edit Course</h3>
      <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      <Button onClick={update} disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}
