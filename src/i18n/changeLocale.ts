"use server";
import { cookies } from "next/headers";

export async function changeLocale(locale: string) {
  const cookiesStore = await cookies();
  cookiesStore.set("locale", locale);
}
