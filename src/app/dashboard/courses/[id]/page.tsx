"use client"
import { ModuleManagement } from '@/components/dashboard/course/module/module-management';
import api from '@/lib/apiHandler';
import { Course } from '@/types/course';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';



export default function CourseManagementPage(
  {params}: { params : Promise<{id:string}>}
) {
 
  const [course, setCourse] = useState<Course | null>(null);
  const t = useTranslations('course.CourseManagement');
  
  // const fetchCourseData = await api.get(`/admin/courses/${courseId}`)
  useEffect(() => {
    const fetchCourse = async () => {
      const {id} = await params;
      try {
        const response = await api.get(`/admin/courses/${id}`);
        setCourse(response.data);
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };
    fetchCourse();
  }, []);

  if (!course) {
    return <div>Loading...</div>;
  }


  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">
       {course.title}
      </h1>
      
      <ModuleManagement courseId={course.id} />
    </div>
  );
}