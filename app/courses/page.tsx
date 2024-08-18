import CoursesPage from "@/components/courses/coursesPage";

export default function Courses() {
  return <CoursesPage pageTitle="الدورات المتاحة" apiUrl="courses" isEnrolled={false} />;
}
