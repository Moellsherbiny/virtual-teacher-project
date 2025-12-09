import { cookies } from 'next/headers';
import {useLocale} from 'next-intl';

export const getCurrentLocale = () => {
  const locale = useLocale();
  return locale;
}

