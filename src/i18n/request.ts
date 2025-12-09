import { cookies } from 'next/headers';
import {getRequestConfig} from 'next-intl/server';
import {Formats} from 'next-intl';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig( async () => {
  const cookiesStore = await cookies();
  const requested = cookiesStore.get('locale')?.value;
  const locale = hasLocale(routing.locales, requested)
  ? requested
    : routing.defaultLocale;;
  const namespaces = [
    'home', "about" , "auth","chatbot",
    "contact" ,"navbar", "footer",
    "otpVerification", "dashboard", "studentCourses",
    "profile", 'courseAdmin', "course", "sidebar"];
  
  let allMessages: Record<string, any> = {};

  for (const ns of namespaces) {
    try {
      const mod = await import(`../messages/${locale}/${ns}.json`);
      allMessages[ns] = mod.default;
    } catch (error) {
      console.warn(`⚠️ Missing translation file: ${locale}/${ns}.json`);
    }
  }

  return {
    locale,
    messages: Object.assign({}, ...Object.entries(allMessages).map(([k, v]) => ({ [k]: v }))),
  };
});


export const formats = {
  dateTime: {
    short: {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }
  },
  number: {
    precise: {
      maximumFractionDigits: 5
    }
  },
  list: {
    enumeration: {
      style: 'long',
      type: 'conjunction'
    }
  }
} satisfies Formats;