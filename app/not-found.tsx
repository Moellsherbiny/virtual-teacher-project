import { Button } from "@/components/ui/button";
import { ArrowRightCircleIcon, ArrowUpCircleIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Notfound() {
  return (
    <div className="flex flex-col justify-center items-center gap-5 h-[calc(100vh-100px)]">
      هذة الصفحة غير موجودة

      <Button variant="outline">
        <ArrowRightCircleIcon className="ml-4"/>
        <Link href="/">العودةالي الصفحة الرئيسية</Link>
      </Button>
    </div>
  );
}
