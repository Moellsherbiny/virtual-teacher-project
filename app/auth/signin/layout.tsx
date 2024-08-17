import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const session = await getServerSession();
  if (session?.user) redirect("/");
  return <>{children}</>;
}

export default Layout;
