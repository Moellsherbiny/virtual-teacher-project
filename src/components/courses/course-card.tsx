"use client"

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Users } from 'lucide-react'
import Image from 'next/image'

interface CourseCardProps {
  course: {
    id: string
    title: string
    description: string | null
    imageUrl: string | null
    instructor: {
      name: string
    }
    modules: any[]
    _count: {
      enrollments: number
    }
    isEnrolled?: boolean
  }
  onEnrollmentChange?: (courseId: string, enrolled: boolean) => void
}

export function CourseCard({ course, onEnrollmentChange }: CourseCardProps) {
  const t = useTranslations('course.courses')
  const totalLessons = course.modules.reduce((acc, module) => acc + (module.lessons?.length || 0), 0)

  return (
    <Card className="hover:shadow-lg transition-shadow bg-gray-50 dark:bg-slate-950 flex flex-col">
      {course.imageUrl ? (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <Image
            src={course.imageUrl}
            alt={course.title}
            width={500}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>
      ) :
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <Image
            src={"/placeholder.webp"}
            alt={course.title}
            width={500}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>
    
    }
      <CardHeader>
        <CardTitle className="text-navy-800 dark:text-white">{course.title}</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          {course.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-orange-500" />
            <span>{course.modules.length} {t('modules')} • {totalLessons} {t('lessons')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-orange-500" />
            <span>{course._count.enrollments} students</span>
          </div>
          <div className="text-sm">
            <span className="font-semibold">{t('instructor')}:</span> {course.instructor.name}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/courses/${course.id}`} className="w-full">
          <Button className="w-full bg-orange-500 hover:bg-orange-600">
            {t('courseDetails')}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}