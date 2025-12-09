import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const session = await auth();
  if (session?.user) redirect("/");
  return <>{children}</>;
}

export default Layout;
