'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RotateCcw, Mail } from 'lucide-react'; // Added Mail icon
import { Input } from '@/components/ui/input'; // Assuming you have a standard Input component
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import axiosInstance from '@/lib/apiHandler';
import type { AxiosError } from 'axios';

// --- Constants ---
const OTP_LENGTH = 6;
const RESEND_TIME_SECONDS = 60;
const REDIRECT_DELAY_MS = 1500;
const EMAIL_STORAGE_KEY = 'email';

// --- Type Definitions for API Responses ---
interface ApiErrorResponse {
  message?: string;
}

function OtpVerificationPage() {
  const t = useTranslations('otpVerification');
  const router = useRouter();

  const [email, setEmail] = useState<string | null>(null);
  const [tempEmail, setTempEmail] = useState(''); // New state for input
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_TIME_SECONDS);
  const [emailEntryMode, setEmailEntryMode] = useState(false); // New state to control UI


  const handleApiError = useCallback((error: unknown, fallbackTranslationKey: string) => {
    let errorMessage = t(fallbackTranslationKey);



    toast.error(t('api_error_title'), {
      description: errorMessage,
    });
  }, [t]);

  /** Load email and set Email Entry Mode if missing */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const rawEmail = localStorage.getItem(EMAIL_STORAGE_KEY);

    if (!rawEmail) {
      // Set the mode to require email input
      setEmailEntryMode(true);
      // Display a warning toast to inform the user why they need to enter the email
      toast.warning(t('missing_email_title'), {
        description: t('missing_email_input_description'), // New translation key
      });
      return;
    }

    // If email found, proceed normally
    setEmail(rawEmail.toLowerCase().trim());
  }, [t]);

  /** Resend timer */
  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(() => {
      setResendTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  const removeEmailFromStorage = useCallback(() => {
    localStorage.removeItem(EMAIL_STORAGE_KEY);
  }, []);


  const handleEmailSubmit = useCallback(async () => {
    // Simple email validation (can be enhanced)
    if (!tempEmail || !tempEmail.includes('@') || !tempEmail.includes('.')) {
      toast.warning(t('email_validation_title'), {
        description: t('email_validation_description'),
      });
      return;
    }

    setLoading(true);
    const formattedEmail = tempEmail.toLowerCase().trim();

    try {
      await axiosInstance.post('/auth/resend-otp', { email: formattedEmail });

      // 2. On success, store the email, switch modes, and start timer
      setEmail(formattedEmail);
      setEmailEntryMode(false);
      setResendTimer(RESEND_TIME_SECONDS);
      setTempEmail(''); // Clear temporary input

      toast.success(t('email_submit_success_title'), {
        description: t('email_submit_success_description'),
      });

    } catch (error: unknown) {
      handleApiError(error, 'email_submit_error_description');
    } finally {
      setLoading(false);
    }
  }, [tempEmail, t, handleApiError]);


  /** Verification */
  const handleVerification = useCallback(async () => {
    if (otp.length !== OTP_LENGTH) {
      toast.warning(t('validation_title'), {
        description: t('validation_description'),
      });
      return;
    }

    if (!email) {
      toast.error(t('verification_error_title'), {
        description: t('missing_email_description_verify'),
      });
      // If verification is attempted without email, switch to email entry mode
      setEmailEntryMode(true);
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post('/auth/verify', { email, otp });

      // Success
      removeEmailFromStorage();
      toast.success(t('verification_success_title'), {
        description: t('verification_success_description'),
      });

      setTimeout(() => router.push('/auth/login'), REDIRECT_DELAY_MS);
    } catch (error: unknown) {
      setOtp('');
      handleApiError(error, 'api_error_description');
    } finally {
      setLoading(false);
    }
  }, [otp, email, t, router, removeEmailFromStorage, handleApiError]);

  /** Resend */
  const handleResend = useCallback(async () => {
    if (resendTimer > 0 || !email) return;

    setResendLoading(true);

    try {
      // API call to resend OTP
      await axiosInstance.post('/auth/resend-otp', { email });

      toast.success(t('resend_success_title'), {
        description: t('resend_success_description'),
      });

      setResendTimer(RESEND_TIME_SECONDS);
    } catch (error: unknown) {
      handleApiError(error, 'resend_error_description');
    } finally {
      setResendLoading(false);
    }
  }, [resendTimer, email, t, handleApiError]);

  const isCodeValid = useMemo(() => otp.length === OTP_LENGTH, [otp]);
  const timerActive = resendTimer > 0;
  const isResendDisabled = loading || resendLoading || timerActive;
  const ResendIcon = (loading || resendLoading) ? Loader2 : RotateCcw;

  // --- RENDER ---

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4">
          <CardTitle className="text-2xl font-bold">
            {emailEntryMode ? t('email_input_title') : t('otp_page_title')}
          </CardTitle>

          <CardDescription>
            {emailEntryMode ? (
              t('email_input_description')
            ) : (
              email &&
              t.rich('otp_page_description_with_email', {
                email,
                b: (chunks) => (
                  <b className="text-primary" key="email-bold">
                    {chunks}
                  </b>
                ),
              })
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex justify-center">
          {emailEntryMode ? (
            <div className="w-full space-y-4">
              <Input
                type="email"
                placeholder={t('email_placeholder')}
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleEmailSubmit();
                }}
              />
            </div>
          ) : (
            <InputOTP
              maxLength={OTP_LENGTH}
              value={otp}
              onChange={setOtp}
              disabled={loading}
              onComplete={handleVerification}
            >
              {/* Input OTP slots remain the same */}
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          {emailEntryMode ? (
            <Button
              onClick={handleEmailSubmit}
              disabled={loading || !tempEmail}
              className="w-full"
            >
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('requesting_otp_button')}
                </div>
              ) : (
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  {t('send_code_button')}
                </div>
              )}
            </Button>
          ) : (
            <>
              <Button
                onClick={handleVerification}
                disabled={loading || !isCodeValid}
                className="w-full"
              >
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('verifying_button')}
                  </div>
                ) : (
                  t('verify_button')
                )}
              </Button>

              <Button
                onClick={handleResend}
                disabled={isResendDisabled}
                variant="link"
                className="w-full p-0 h-auto text-sm justify-center text-muted-foreground hover:text-primary"
              >
                <ResendIcon
                  className={`mr-2 h-4 w-4 ${(loading || resendLoading) ? 'animate-spin' : ''
                    }`}
                />
                {timerActive
                  ? t.rich('resend_wait', {
                    seconds: resendTimer,
                    b: (chunks) => <b className="text-foreground">{chunks}</b>,
                  })
                  : t('resend_link')}
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default OtpVerificationPage;