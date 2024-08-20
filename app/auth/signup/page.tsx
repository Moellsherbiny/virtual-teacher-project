"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import axiosInstance from "@/lib/apiHandler";

const signupSchema = z
  .object({
    name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
    email: z.string().email("البريد الإلكتروني غير صالح"),
    password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: SignupFormValues) {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/auth/signup", {
        email: data.email,
        password: data.password,
        name: data.name,
      });
      if (response.status === 201) router.push("/auth/signin");
      else console.log("error");

      // Here you would typically call your API to create the user
      // For example:
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      //
      // if (response.ok) {
      //   router.push('/auth/login');
      // } else {
      //   throw new Error('Signup failed');
      // }

      // For now, we'll just simulate a successful signup
      console.log("Signup data:", data);
      router.push("/auth/login");
    } catch (error) {
      console.error("Signup Failed:", error);
      // Handle error (e.g., show error message)
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            إنشاء حساب جديد
          </CardTitle>
          <CardDescription className="text-center">
            أنشئ حسابك للوصول إلى جميع الميزات
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل اسمك" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل بريدك الإلكتروني" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>كلمة المرور</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="أدخل كلمة المرور"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تأكيد كلمة المرور</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="أعد إدخال كلمة المرور"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "جاري التحميل..." : "إنشاء الحساب"}
              </Button>
              <Button
                variant="secondary"
                type="button"
                className="w-full"
                disabled={isLoading}
                onClick={() => signIn("google", { redirectTo: "/" })}
              >
                التسجيل باستخدام Google
                <span className="mr-2 text-2xl">
                  <FcGoogle />
                </span>
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-center">
          <p>
            لديك حساب بالفعل؟
            <a href="/auth/signin" className="text-blue-600 mr-2 hover:underline">
              تسجيل الدخول
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
