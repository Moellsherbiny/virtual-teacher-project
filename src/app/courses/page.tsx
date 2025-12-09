"use client"

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

import { CourseCard } from '@/components/courses/course-card'
import { Input } from '@/components/ui/input'
import api  from '@/lib/apiHandler'
import { Search } from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string | null
  imageUrl: string | null
  instructor: {
    id: string
    name: string
  }
  modules: any[]
  _count: {
    enrollments: number
  }
  isEnrolled?: boolean
}

export default function CoursesPage() {
  const t = useTranslations('course')
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/student/courses')
        setCourses(response.data)
      } catch (error) {
        console.error('Failed to fetch courses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEnrollmentChange = (courseId: string, enrolled: boolean) => {
    setCourses(courses.map(course => 
      course.id === courseId 
        ? { ...course, isEnrolled: enrolled }
        : course
    ))
  }

  return (
    <main className="min-h-screen">
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            {t('courses.allCourses')}
          </h1>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder={t('courses.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600 dark:text-gray-300">{t('common.loading')}</div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">{t('noCourses')}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course}
                onEnrollmentChange={handleEnrollmentChange}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}