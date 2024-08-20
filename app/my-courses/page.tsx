"use client"
import CoursesPage from "@/components/courses/coursesPage";
import { useSession } from "next-auth/react";

export default function Courses() {
  const session = useSession();

  const userId =  session?.data?.user.id as string;
  

  return (
    <CoursesPage
      pageTitle="دوراتي"
      apiUrl={`courses/my-courses?userId=${userId}`}
      isEnrolled={true}
    />
  );
}
