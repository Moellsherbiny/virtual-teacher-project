"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/apiHandler";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Feedback {
  result: string;
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
        const response = await axiosInstance.get<{ results: Feedback[] }>(
          `/feedback?userId=${userId}`
        );
        const data = response.data.results;
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
      <h1 className="text-4xl font-bold text-right mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
        نتائج الاختبار
      </h1>
      {feedbacks.map((feedback, id) => (
        <Card key={id} className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-right text-2xl bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              الاختبار {id + 1}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-right text-lg font-medium bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
              {feedback.result}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FeedbackPage;
