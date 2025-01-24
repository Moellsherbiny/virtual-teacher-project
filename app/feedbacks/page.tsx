"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/apiHandler";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Feedback {
  id: number;
  quiz: string;
  result: string;
  score: number;
  userId: string;
}

const FeedbackPage = ({
  searchParams,
}: {
  searchParams: { response_id: string };
}) => {
  const session = useSession();
  const userId = session.data?.user.id as string;
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        if (!userId) return;
        const response = await axiosInstance.get(`/feedbacks?userId=${userId}`);
        const data = response.data.feedbacks;
        console.log(data);
        setFeedbacks(data);
      } catch (error) {
        console.error("خطأ في جلب التعليقات:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbacks();
  }, [userId]);

  if (isLoading)
    return (
      <div className="container mx-auto p-4 space-y-4 rtl">
        <Skeleton className="h-12 w-full" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );

  return (
    <div className="container mx-auto p-4 space-y-4 rtl">
      <Table dir="rtl" className="text-right">
        <TableCaption>نتائج الاختبارات التي اجريتها</TableCaption>
        <TableHeader dir="rtl" className="text-right">
          <TableRow>
            <TableHead className="text-right">#</TableHead>
            <TableHead className="text-right">اختبار</TableHead>
            <TableHead className="text-right">الدرجات</TableHead>
            <TableHead className="text-right">النتيجة</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedbacks.map((feedback, index) => {
            return (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{feedback.quiz}</TableCell>
                <TableCell><strong>{feedback.score}</strong> <span className="text-muted-foreground font-light"> من 10</span></TableCell>
                <TableCell>{feedback.result}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default FeedbackPage;
