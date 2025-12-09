'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { signIn } from 'next-auth/react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FcGoogle } from 'react-icons/fc';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Zod schema
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const t = useTranslations('auth');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);

    const result = await signIn('credentials', {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    setLoading(false);

    if (result?.error) {
      // Map backend error codes to user-friendly messages
      const errorMap: Record<string, string> = {
        MISSING_CREDENTIALS: t('missingCredentials'),
        USER_NOT_FOUND: t('userNotFound'),
        NO_PASSWORD_SET: t('noPasswordSet'),
        INVALID_PASSWORD: t('invalidPassword'),
        EMAIL_NOT_VERIFIED: t('emailNotVerified'),
        CredentialsSignin: t('invalidCredentials'),
        UNKNOWN_ERROR: t('unknownError'),
      };

      const message = errorMap[result.error] || t('unknownError');

      toast.error(t('loginFailed'), {
        description: message,
      });

      return;
    }

    toast.success(t('loginSuccess'), {
      description: t('welcomeBack'),
    });
    router.push('/');
  };


  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signIn('google');
    } catch (err) {
      toast.error('Google login failed', { description: 'Please try again.', });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="shadow-lg border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-[#FF6636] to-[#ff8659] text-white pb-8 pt-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{t('signInTitle')}</h1>
            <p className="text-white/90 text-sm">{t('signInSubtitle')}</p>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">{t('email')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder={t('email')}
                        className="rounded-xl border-gray-300 focus:border-[#FF6636] focus:ring-1 focus:ring-[#FF6636] transition"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">{t('password')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder={t('password')}
                        className="rounded-xl border-gray-300 focus:border-[#FF6636] focus:ring-1 focus:ring-[#FF6636] transition"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                disabled={!form.formState.isValid || loading}
                className="w-full bg-gradient-to-r from-[#FF6636] to-[#FF8560] text-white font-semibold rounded-xl px-6 py-2 shadow hover:scale-105 transform transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {loading ? 'Signing in...' : t('signin')}
              </Button>
            </form>
          </Form>

          {/* Divider */}
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span className="flex-1 border-b"></span>
            <span>{t('signinWith')}</span>
            <span className="flex-1 border-b"></span>
          </div>

          {/* Social Login */}
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl border-gray-300 hover:bg-gray-100 hover:shadow-md transition-all duration-200 px-4 py-2"
          >
            <FcGoogle />
            {loading ? 'Loading...' : t('google')}
          </Button>
        </CardContent>

      </Card>
    </div>
  );
}
