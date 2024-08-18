import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

async function layout({ children }: { children: Readonly<ReactNode> }) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/auth/signin");
  }
  return <>{children}</>;
}

export default layout;
