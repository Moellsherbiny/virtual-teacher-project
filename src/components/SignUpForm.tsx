'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm, UseFormRegister, FieldErrors, UseFormTrigger } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { 
  Loader2, 
  Mail, 
  Lock, 
  User, 
  AlertCircle 
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {toast} from "sonner"
import axiosInstance from '@/lib/apiHandler';
import { useRouter } from 'next/navigation';


export const getSignupSchema = (t: (key: string) => string) =>
  z
    .object({
      firstName: z.string().min(2, t("firstNameRequired")),
      lastName: z.string().min(2, t("lastNameRequired")),
      email: z.string().email(t("invalidEmail")),
      password: z.string().min(6, t("passwordMin")),
      confirmPassword: z.string().min(6, t("confirmPasswordMin")),
      agree: z.boolean().refine((v) => v === true, {
        message: t("mustAgree"),
      }),
    })
    .superRefine(({ password, confirmPassword }, ctx) => {
      if (password !== confirmPassword) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: t("passwordsNotMatch"),
        });
      }
    });

export type SignupFormValues = z.infer<ReturnType<typeof getSignupSchema>>;

interface CustomInputProps {
  name: keyof SignupFormValues;
  placeholder: string;
  type?: string;
  icon?: React.ElementType;
  register: UseFormRegister<SignupFormValues>;
  errors: FieldErrors<SignupFormValues>;
  trigger?: UseFormTrigger<SignupFormValues>; 
}

const CustomInput = ({
  name,
  placeholder,
  type = 'text',
  icon: Icon,
  register,
  errors,
  trigger
}: CustomInputProps) => {
  const error = errors[name];

  return (
    <div className="space-y-1.5">
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        )}

        <Input
          type={type}
          placeholder={placeholder}
          // Dynamic classes for error state and icon padding
          className={`${Icon ? 'pl-10' : ''} ${
            error ? 'border-red-300 focus-visible:ring-red-400' : ''
          }`}
          {...register(name, {
            // Optional: Special logic for password confirmation to re-validate immediately 
            // if the user fixes the password, or we can leave it to onBlur standard.
            onChange: () => {
              if (name === 'confirmPassword' && trigger) {
                // We typically don't trigger validation on change to avoid the "red text while typing"
                // issue, but for confirm password, sometimes we want to clear the error immediately
                // if they match. Remove this block if you want strictly onBlur only.
                trigger('confirmPassword'); 
              }
            }
          })}
        />
      </div>

      {/* Error Message with Animation/Icon */}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="h-3 w-3" />
          {error.message}
        </p>
      )}
    </div>
  );
};

// ---------------- MAIN COMPONENT ----------------

export default function SignupForm() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const tAuth = useTranslations('auth.errors');
  const signupSchema = getSignupSchema(tAuth);
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur', 
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agree: false,
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setLoading(true);
    

    try {
      const name = `${values.firstName} ${values.lastName}`;

      const res = await axiosInstance.post('/auth/signup', {
        name,
        email: values.email,
        password: values.password,
      });

      if (res.status === 201) {
        localStorage.setItem('email', values.email);
        toast.success( t('signupSuccess'));
        form.reset();
        router.push('/auth/verify')
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="shadow-lg border-0 overflow-hidden">
        {/* Header */}
        <CardHeader className="bg-gradient-to-br from-[#FF6636] to-[#ff8659] text-white py-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">{t('signUpTitle')}</h1>
            <p className="text-white/90 text-sm">{t('signUpSubtitle')}</p>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-3">
              <CustomInput
                name="firstName"
                placeholder={t('firstName')}
                icon={User}
                register={form.register}
                errors={form.formState.errors}
              />
              <CustomInput
                name="lastName"
                placeholder={t('lastName')}
                icon={User}
                register={form.register}
                errors={form.formState.errors}
              />
            </div>

            {/* Email Field */}
            <CustomInput
              name="email"
              placeholder={t('email')}
              type="email"
              icon={Mail}
              register={form.register}
              errors={form.formState.errors}
            />

            {/* Password Fields */}
            <div className="grid md:grid-cols-2 gap-3">
              <CustomInput
                name="password"
                placeholder={t('createPassword')}
                type="password"
                icon={Lock}
                register={form.register}
                errors={form.formState.errors}
              />
              <CustomInput
                name="confirmPassword"
                placeholder={t('confirmPassword')}
                type="password"
                icon={Lock}
                register={form.register}
                errors={form.formState.errors}
                trigger={form.trigger} // Pass trigger to allow manual re-check if needed
              />
            </div>

            {/* Terms & Conditions Checkbox */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="agree-terms"
                  checked={form.watch('agree')}
                  onCheckedChange={(val) => form.setValue('agree', !!val, { shouldValidate: true })}
                />
                <label 
                  htmlFor="agree-terms" 
                  className="text-sm cursor-pointer select-none"
                >
                  I agree to the terms & conditions
                </label>
              </div>
              
              {form.formState.errors.agree && (
                <p className="text-xs text-red-500 flex items-center gap-1 animate-in fade-in">
                  <AlertCircle className="h-3 w-3" />
                  {form.formState.errors.agree.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#FF6636] hover:bg-[#e85b2f] h-11 shadow-md transition-all active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                t('signup')
              )}
            </Button>
          </form>


          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">{t('signupWith')}</span>
            </div>
          </div>

          {/* Social Login */}
          <Button
            variant="outline"
            className="w-full h-11 hover:bg-gray-50 transition-colors"
            onClick={() => signIn('google', { callbackUrl: '/' })}
          >
            {t('google')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}