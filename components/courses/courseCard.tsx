import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
  } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import Link from "next/link";
  import Image from "next/image";
  import { ArrowUpRight } from "lucide-react";
  
  interface CourseCardProps {
    id: number;
    title: string;
    description: string;
    image: string;
    prefix: string;
    isEnrolled: boolean;
  }
  
  export function CourseCard({
    id,
    title,
    description,
    image,
    prefix,
    isEnrolled,
  }: CourseCardProps) {
    return (
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
        <CardHeader className="p-0">
          <div className="relative w-full h-48">
            <Image
              src={`${prefix}${image}`}
              style={{ objectFit: "cover" }}
              alt={title}
              fill={true}
            />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <CardTitle className="text-xl mb-2">{title}</CardTitle>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button className="flex w-full">
            {isEnrolled ? (
              <Link href={`/my-courses/${id}`}>بدء الدراسة</Link>
            ) : (
              <Link href={`/courses/${id}`}>التفاصيل</Link>
            )}
          </Button>
          {isEnrolled && (
            <Button
              variant="link"
              className="flex justify-end gap-1 items-center w-full text-gray-500 hover:text-blue-600 hover:gap-2 duration-300"
            >
              <ArrowUpRight />
              <Link href={`/my-courses/${id}/quiz`}>اجراء اختبار</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }