"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import axiosInstance from "@/lib/apiHandler";
import Loader from "@/components/common/Loader";
import { renderMessageContent } from "@/components/ai-message-format/messageFormater";

const fetchAIContent = async (lessonId: string) => {
  try {
    const aiResponse = await axiosInstance.post("/generation/content", {
      lessonId,
    });
    return aiResponse.data.message;
  } catch (err) {
    console.error("Error fetching AI-generated content:", err);
    throw new Error("Failed to fetch AI-generated content.");
  }
};

export default function LessonPage({
  params,
}: {
  params: { id: string; lessonId: string };
}) {
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        const aiContent = await fetchAIContent(params.lessonId);
        if (aiContent) {
          setContent(aiContent.content);
          setError(null);
        } else {
          setError("لم يتم العثور على محتوى للدرس.");
        }
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [params.lessonId]);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-bl from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="container mx-auto p-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href={`/my-courses/${params.id}`}>
            <ArrowRight className="ml-2 h-4 w-4" /> العودة إلى الدروس
          </Link>
        </Button>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader />
              </div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                {renderMessageContent(content || "لم يتم العثور على محتوى.")}
                {isLoadingAI && (
                  <div className="mt-4 text-center text-gray-500">
                    جاري إنشاء المحتوى...
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
