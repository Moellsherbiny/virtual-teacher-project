"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import api from "@/lib/apiHandler";
import { PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function LessonCreateDialog({ moduleId }: { moduleId: string }) {
  const t = useTranslations("courseAdmin.lessons");

  const [title, setTitle] = useState("");
  const [type, setType] = useState("VIDEO");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [order, setOrder] = useState<number | undefined>(undefined);

  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    try {
      setLoading(true);
      toast.loading("Creating lesson...");

      const payload = {
        title,
        content: content || null,
        videoUrl: videoUrl || null,
        fileUrl: fileUrl || null,
        order: order ?? null,
        type,
        moduleId,
      };

      await api.post(`/admin/lessons`, payload);

      toast.dismiss();
      toast.success("Lesson created successfully");

      setLoading(false);

    
      setTitle("");
      setContent("");
      setVideoUrl("");
      setFileUrl("");
      setOrder(undefined);
      setType("VIDEO");
    } catch (error: any) {
      toast.dismiss();
      toast.error(error?.response?.data?.error || "Failed to create lesson");
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="me-2 h-4 w-4" />
          {t("addLesson")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">

          <div className="flex flex-col gap-2">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Lesson title"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Lesson Type</Label>
            <Select value={type} onValueChange={(val) => setType(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select lesson type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIDEO">VIDEO</SelectItem>
                <SelectItem value="TEXT">TEXT</SelectItem>
                <SelectItem value="MATERILAS">MATERILAS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === "TEXT" && (
            <div className="flex flex-col gap-2">
              <Label>Text Content</Label>
              <Textarea
                className="min-h-[110px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write lesson content..."
              />
            </div>
          )}

          {type === "VIDEO" && (
            <div className="flex flex-col gap-2">
              <Label>Video URL</Label>
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/..."
              />
            </div>
          )}

          {type === "MATERILAS" && (
            <div className="flex flex-col gap-2">
              <Label>File URL</Label>
              <Input
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label>{t("order")}</Label>
            <Input
              type="number"
              value={order ?? ""}
              onChange={(e) => setOrder(Number(e.target.value))}
              placeholder="Order number"
            />
          </div>

        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>

          <Button onClick={handleCreate} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
