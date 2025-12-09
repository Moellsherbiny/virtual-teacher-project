import { Button } from "@/components/ui/button";
import { ArrowRightCircleIcon, ArrowUpCircleIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import Image from "next/image";
export default function Notfound() {
  return (
    <div className="container">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-4">
          <h1 className="text-6xl font-bold text-gray-100">Error 404</h1>
          <h2 className="text-4xl font-bold text-gray-900">Oops! page not found</h2>
          <p className="max-w-96 text-gray-700">
            Something went wrong. It’s look that your requested could not be found. It's look like the link is broken or the page is removed.
          </p>
          <Button variant="default" size="lg">
            Go Back
          </Button>
        </div>
        <div>
          <Image
            src="/images/notFound.png"
            alt="Not Found"
            width={500}
            height={100}
          />
        </div>
      </div>
    </div>
  );
}
