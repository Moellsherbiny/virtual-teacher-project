import {routing} from '@/i18n/routing';
import {formats} from '@/i18n/request';
import type {loadMessages} from "@/i18n/loadMessages"

type Messages = Awaited<ReturnType<typeof loadMessages>>;

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: Messages;
    Formats: typeof formats;
  }
}