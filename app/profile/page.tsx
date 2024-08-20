"use client";

import { useState, useEffect, ChangeEvent, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/apiHandler";
import { useSession } from "next-auth/react";

const profileSchema = z.object({
  file: z.any().optional(),
  name: z.string().min(1, 'الاسم مطلوب'),
  email: z.string().email('عنوان البريد الإلكتروني غير صالح'),
  bio: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [avatarSrc, setAvatarSrc] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    setAvatarSrc(session?.user?.image as string);
  }, [session?.user?.image]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const formData = new FormData();
      formData.append('file', data.file as File);

      const response = await axiosInstance.post('/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = response.data;

      if (result.success) {
        setAvatarSrc(`/uploads/${result.filename}`);
      } else {
        console.error('Upload failed:', result.message);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      // Restrict file size to 2MB
      alert('حجم الملف كبير جداً. الرجاء اختيار صورة بحجم أقل من 2MB.');
      return;
    }

    register('file', { value: file });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="container mx-auto p-4 font-arabic">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-right">
            الملف الشخصي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center mb-6">
            <Avatar
              className="w-24 h-24 mb-4 cursor-pointer hover:opacity-80"
              onClick={handleAvatarClick}
            >
              <AvatarImage
                src={avatarSrc}
                alt="صورة المستخدم"
                width={96}
                height={96}
                className="rounded-full object-cover"
                loading="lazy"
              />
              <AvatarFallback>
                {session?.user?.name?.slice(0, 2) as string}
              </AvatarFallback>
            </Avatar>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
              aria-label="Upload Profile Image"
            />
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-2 text-right">
                الاسم
              </label>
              <Input
                id="name"
                defaultValue={session?.user?.name}
                placeholder={session?.user?.name as string}
                className="text-right"
                {...register("name")}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <div className="text-red-500 text-right">
                  {errors.name.message}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-right">
                البريد الإلكتروني
              </label>
              <Input
                id="email"
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                defaultValue={session?.user?.email as string}
                className="text-right"
                {...register("email")}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <div className="text-red-500 text-right">
                  {errors.email.message}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="bio" className="block mb-2 text-right">
                نبذة عنك
              </label>
            </div>
            <Button type="submit" className="w-full hover:bg-blue-600">
              حفظ التغييرات
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
