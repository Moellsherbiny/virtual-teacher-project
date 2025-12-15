'use client'

import { useState, useTransition } from "react";
import Link from "next/link";
import { deleteQuiz } from "@/actions/admin-quiz-actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash, FileBarChart } from "lucide-react";
import { toast } from "sonner";

interface QuizActionsProps {
  quizId: string;
}

export function QuizActions({ quizId }: QuizActionsProps) {
  const [isPending, startTransition] = useTransition();


  const handleDelete = () => {
    if (confirm("هل أنت متأكد من حذف هذا الاختبار نهائياً؟")) {
      startTransition(async () => {
        const res = await deleteQuiz(quizId);
        if (res.success) {
          toast.success("تم الحذف", { description: "تم حذف الاختبار بنجاح" });
        } else {
          toast.error("خطأ",{  description: res.error });
        }
      });
    }
  };

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">فتح القائمة</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
        
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/quizzes/${quizId}`} className="flex items-center cursor-pointer">
            <Edit className="ml-2 h-4 w-4" /> تعديل الأسئلة
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/quizzes/${quizId}/results`} className="flex items-center cursor-pointer">
            <FileBarChart className="ml-2 h-4 w-4" /> عرض النتائج
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleDelete} 
          disabled={isPending}
          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
        >
          <Trash className="ml-2 h-4 w-4" />
          {isPending ? "جاري الحذف..." : "حذف الاختبار"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}