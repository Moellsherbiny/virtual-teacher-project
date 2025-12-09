import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from './ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from './ui/input-otp';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, Info, RotateCcw } from 'lucide-react'; // Import icons for better visuals
import { verifyOTP } from '@/lib/verifyOTP';

// Define the type for the notification message
type Notification = {
  title: string;
  description: string;
  type: 'success' | 'error' | 'info';
};

// Map message type to an icon component
const iconMap = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};


const RESEND_TIME_SECONDS = 60;

function verifyForm({ email }: { email: string }) {
  const t = useTranslations('otpVerification');
  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [resendTimer, setResendTimer] = useState<number>(RESEND_TIME_SECONDS);

  const isCodeValid = useMemo(() => otp.length === 6, [otp]);

  // --- Resend Countdown Timer Effect ---
  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(() => {
      setResendTimer(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer); // Use clearInterval for setInterval cleanup
  }, [resendTimer]);

  const handleVerification = useCallback(async () => {
    // Basic client-side validation
    if (otp.length !== 6) {
      setNotification({
        title: t('validation_title'),
        description: t('validation_description'),
        type: 'error'
      });
      return;
    }

    setLoading(true);
    setNotification(null); // Clear previous message

    try {
      const isSuccess = await verifyOTP(email, otp);

      if (isSuccess) {
        setNotification({
          title: t('verification_success_title'),
          description: t('verification_success_description'),
          type: 'success'
        });
      } else {
        setNotification({
          title: t('verification_error_title'),
          description: t('verification_error_description'),
          type: 'error'
        });
        setOtp('');
      }
    } catch (error) {
      // Handle actual network or server errors
      console.error('Verification failed:', error);
      setNotification({
        title: t('api_error_title'),
        description: t('api_error_description'),
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [otp, t]);

  const handleResend = useCallback(async () => {
    if (resendTimer > 0) return;

    setLoading(true);
    setNotification(null);

    try {
      // TODO: Replace with actual resend API call
      console.log('Resend OTP API called');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setNotification({
        title: t('resend_success_title'),
        description: t('resend_success_description'),
        type: 'info'
      });
      setResendTimer(RESEND_TIME_SECONDS); // Reset the timer
    } catch (error) {
      console.error('Resend failed:', error);
      setNotification({
        title: t('api_error_title'),
        description: t('resend_error_description'),
        type: 'error'
      });
    } finally {
      setLoading(false);
    }

  }, [resendTimer, t]);

  // Derived state for better readability
  const timerActive = resendTimer > 0;

  const ResendIcon = timerActive ? Loader2 : RotateCcw; // Icon for resend button

  // Determine Alert Icon dynamically
  const CurrentAlertIcon = notification ? iconMap[notification.type] : null;

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className='space-y-4'>
        <CardTitle className='text-2xl font-bold'>{t('otp_page_title')}</CardTitle>
        <CardDescription>
          {email
            ? t('otp_page_description_with_email', { email })
            : t('otp_page_description_generic')}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid gap-6">
          <div className="flex flex-col items-center gap-2">
            <label htmlFor="otp-input" className="sr-only">
              {t('otp_input_label')}
            </label>
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              disabled={loading}
              // Optional: Auto-submit on completion
              onComplete={handleVerification}
            >
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
          </div>

          {notification && CurrentAlertIcon && (
            <Alert
              variant={notification.type === 'error' ? 'destructive' : 'default'}
              className={`flex items-start ${notification.type === 'error' ? 'border-red-500' : 'border-green-500'}`}
            >
              <CurrentAlertIcon className="h-4 w-4 mr-3 mt-0.5" />
              <div className="flex flex-col">
                <AlertTitle>{notification.title}</AlertTitle>
                <AlertDescription>{notification.description}</AlertDescription>
              </div>
            </Alert>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
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
          disabled={loading || timerActive}
          variant="link"
          className="w-full p-0 h-auto text-sm text-center justify-center disabled:opacity-50 transition-opacity"
        >
          <ResendIcon className={`mr-2 h-4 w-4 ${timerActive ? 'animate-spin' : ''}`} />
          {timerActive
            ? t('resend_wait', { seconds: resendTimer.toString() })
            : t('resend_link')}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default verifyForm
