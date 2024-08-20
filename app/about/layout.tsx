import { Metadata } from "next";
import React, { ReactNode } from "react";

export const metadata: Metadata = {
  title: " حول | المعلم الافتراضي",
  description:
    "تعرف على المزيد عن المعلم الذكي وكيف يمكنه مساعدتك في رحلتك التعليمية",
};
function layout({ children }: Readonly<{ children: ReactNode }>) {
  return <>{children}</>;
}

export default layout;
