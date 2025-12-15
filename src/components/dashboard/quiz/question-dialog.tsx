'use client'

import { useEffect, useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { upsertQuestion } from "@/actions/admin-quiz-actions";
import { questionSchema } from "@/lib/schemas";
import { QuestionType } from "@/generated/prisma/enums";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, Trash } from "lucide-react";
import { toast } from "sonner";

interface QuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quizId: string;
  questionToEdit?: any;
}

export function QuestionDialog({ open, onOpenChange, quizId, questionToEdit }: QuestionDialogProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question: "",
      maxScore: 1,
      type: QuestionType.MULTIPLE_CHOICE,
      answers: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "answers",
  });

  // تعبئة النموذج عند التعديل
  useEffect(() => {
    if (questionToEdit) {
      form.reset({
        id: questionToEdit.id,
        question: questionToEdit.text,
        maxScore: questionToEdit.points,
        type: questionToEdit.type,
        answers: questionToEdit.answers || [],
      });
    } else {
      form.reset({
        question: "",
        maxScore: 1,
        type: QuestionType.MULTIPLE_CHOICE,
        answers: [{ text: "", isCorrect: false }, { text: "", isCorrect: false }], // Default answers
      });
    }
  }, [questionToEdit, form, open]);

  // مراقبة نوع السؤال لتغيير الواجهة
  const questionType = form.watch("type");

  async function onSubmit(values: z.infer<typeof questionSchema>) {
    startTransition(async () => {
      const res = await upsertQuestion(quizId, values);
      if (res.success) {
        toast("تم الحفظ", { description: "تم حفظ السؤال بنجاح" });
        onOpenChange(false);
        form.reset();
      } else {
        toast.error("خطأ", { description: res.error });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl sm:max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle>{questionToEdit ? "تعديل السؤال" : "إضافة سؤال جديد"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* نوع السؤال */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نوع السؤال</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={QuestionType.MULTIPLE_CHOICE}>اختيار من متعدد</SelectItem>
                      <SelectItem value={QuestionType.TRUE_FALSE}>صح أم خطأ</SelectItem>
                      <SelectItem value={QuestionType.WRITTEN}>سؤال مقالي</SelectItem>
                      <SelectItem value={QuestionType.COMPLETE}>أكمل الفراغ</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* نص السؤال */}
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نص السؤال</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل السؤال هنا..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* النقاط */}
            <FormField
              control={form.control}
              name="maxScore"

              render={({ field }) => (
                <FormItem>
                  <FormLabel>الدرجة</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                      } />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* قسم الإجابات (يظهر فقط للأنواع التي تحتاج إجابات) */}
            {(questionType === QuestionType.MULTIPLE_CHOICE || questionType === QuestionType.TRUE_FALSE) && (
              <div className="space-y-3 border p-4 rounded-md bg-slate-50 dark:bg-slate-900">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-sm">الإجابات</h4>
                  {questionType === QuestionType.MULTIPLE_CHOICE && (
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ text: "", isCorrect: false })}>
                      <Plus className="w-3 h-3 ml-1" /> إضافة خيار
                    </Button>
                  )}
                </div>

                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-3 items-end">
                    <FormField
                      control={form.control}
                      name={`answers.${index}.text`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder={`الخيار ${index + 1}`} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`answers.${index}.isCorrect`}
                      render={({ field }) => (
                        <FormItem className="pb-3">
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer text-xs">صحيحة؟</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    {questionType === QuestionType.MULTIPLE_CHOICE && (
                      <Button type="button" variant="ghost" size="icon" className="mb-2 text-red-500" onClick={() => remove(index)}>
                        <Trash className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <FormMessage>{form.formState.errors.answers?.message}</FormMessage>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                حفظ السؤال
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}