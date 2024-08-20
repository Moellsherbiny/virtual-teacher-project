"use client";
import { useEffect, useState } from "react";
import { CourseCard } from "@/components/courses/courseCard";
import { motion } from "framer-motion";
import axiosInstance from "@/lib/apiHandler";
import Loader from "../common/Loader";

interface Course {
  course_id: number;
  title: string;
  description: string;
  field: string;
  course_image: string;
}

export default function CoursesPage({
  pageTitle,
  apiUrl,
  userId,
  isEnrolled = false,
}: {
  pageTitle: string;
  apiUrl: string;
  userId?: string;
  isEnrolled: boolean;
}) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const url = !userId ? apiUrl : `${apiUrl}?userId=${userId}`;

        const response = await axiosInstance.get(`/${url}`);
        const data = await response.data.courses;
        setCourses(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching enrollments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [apiUrl, userId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <Loader />
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="h-[calc(100vh-100px)] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center items-center  rounded-xl">
        انت لم تشترك في اي دورة تعليمية بعد
        
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 rounded-xl">
      <div className="container mx-auto p-8">
        <h1 className="text-xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
          {pageTitle}
        </h1>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {courses.map((course, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CourseCard
                id={course.course_id}
                title={course.title}
                image={course.course_image}
                description={course.description}
                prefix="/images/courses/"
                isEnrolled={isEnrolled}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
