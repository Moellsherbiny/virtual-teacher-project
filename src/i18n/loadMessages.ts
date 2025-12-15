import { routing } from './routing';

export async function loadMessages<T extends string = typeof routing.locales[number]>(
  locale: T = routing.defaultLocale as T
) {
  const namespaces = [
    'home', 'about', 'auth', 'chatbot',
    'contact', 'navbar', 'footer',
    'otpVerification', 'dashboard', 'studentCourses',
    'profile', 'course', 'courseAdmin' , 'sidebar',
     'dashboardMyCourses' , 'studentDashboard', 'courseStudy'
  ] as const;

  const allMessages: Record<string, any> = {};

  for (const ns of namespaces) {
    try {
      const mod = await import(`../messages/${locale}/${ns}.json`);
      allMessages[ns] = mod.default;
    } catch (err) {
      console.warn(`⚠️ Missing translation file: ${locale}/${ns}.json`);
    }
  }

  return allMessages as { [K in typeof namespaces[number]]: any };
}
