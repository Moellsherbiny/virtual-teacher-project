import axiosInstance from "@/lib/apiHandler";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

export const useEnrollment = (courseId: string, userId: string) => {
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handleEnroll = async () => {
    if (!courseId || !userId) {
      toast.error("خطأ", { description: "بيانات الدورة أو المستخدم غير متوفرة", });
      return;
    }

    setIsEnrolling(true);

    try {
      const { data, status } = await axiosInstance.post(
        "/courses/enrollments",
        {
          userId,
          courseId,
        }
      );

      if (status === 409) {
        toast.error("خطأ", {
          description: "انت منضم بالفعل",
        });
      }
      if (status === 201) {
        toast("تم بنجاح", {
          description: data.message,
        });
      } else {
        throw new Error(data.message || "فشل الانضمام للدورة");
      }
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.status === 409 && "انت منضم بالفعل"
          : "فشل الانضمام للدورة. حاول مرة أخرى لاحقًا.";

      toast.error("خطأ", {
        description: errorMessage,
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  return { handleEnroll, isEnrolling };
};
