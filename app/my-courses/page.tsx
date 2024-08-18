"use client"
import Loader from "@/components/common/Loader";
import CoursesPage from "@/components/courses/coursesPage";
import { useSession } from "next-auth/react";

export default function Courses() {
  const session = useSession();

  const userId =  session?.data?.user.id as string;
  
  if (!userId) {
    return <Loader />;
  }
  return (
    <CoursesPage
      pageTitle="دوراتي"
      apiUrl={`courses/my-courses?userId=${userId}`}
      isEnrolled={true}
    />
  );
}
