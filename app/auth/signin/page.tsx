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
import { useToast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AxiosError } from "axios";
import { ToastAction } from "@/components/ui/toast";

const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        console.error("Login Failed:", result.error);
        toast({
          title: "فشل تسجيل الدخول",
          description: "برجاء التأكد من صحة البيانات",
          action: (
            <ToastAction altText="المحاولة مجددا">المحاولة مجددا</ToastAction>
          ),
        });
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Login Failed:", error);
      const errorMsg =
        error instanceof AxiosError
          ? "هذا المستخدم غير موجود"
          : "برجاء التأكد من صحة بياناتك ثم قم بالمحاولة مرة اخري";
      toast({
        title: "فشل تسجيل الدخول",
        description: errorMsg,
        variant: "destructive",
        action: (
          <ToastAction altText="المحاولة مجددا">المحاولة مجددا</ToastAction>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center my-3">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            تسجيل الدخول
          </CardTitle>
          <CardDescription className="text-center">
            قم بتسجيل الدخول إلى حسابك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "جاري التحميل..." : "تسجيل الدخول"}
              </Button>
              <Button
                variant="secondary"
                type="button"
                className="w-full"
                disabled={isLoading}
                onClick={() => signIn("google", { redirectTo: "/" })}
              >
                تسجيل الدخول باستخدام Google
                <span className="mr-2 text-2xl">
                  <FcGoogle />
                </span>
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-center">
          <p>
            ليس لديك حساب؟
            <Link
              href="/auth/signup"
              className="text-blue-600 mr-2 hover:underline"
            >
              إنشاء حساب
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
