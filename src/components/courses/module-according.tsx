"use client"

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Video, FileText, FolderOpen, PlayCircle, Lock } from 'lucide-react'

interface ModuleAccordionProps {
  module: {
    id: string
    title: string
    lessons: Array<{
      id: string
      title: string
      type: 'VIDEO' | 'TEXT' | 'MATERILAS'
      order: number
    }>
  }
  moduleNumber: number
  courseId: string
  isEnrolled?: boolean
}

export function ModuleAccordion({ module, moduleNumber, courseId, isEnrolled = false }: ModuleAccordionProps) {
  const locale = useLocale()
  const t = useTranslations('course.lessons')

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return <Video size={16} className="text-orange-500" />
      case 'TEXT':
        return <FileText size={16} className="text-orange-500" />
      case 'MATERILAS':
        return <FolderOpen size={16} className="text-orange-500" />
      default:
        return <FileText size={16} className="text-orange-500" />
    }
  }

  return (
    <Accordion type="single" collapsible className="border rounded-lg">
      <AccordionItem value={module.id} className="border-none">
        <AccordionTrigger className="px-4 hover:no-underline hover:bg-gray-50 dark:hover:bg-navy-700">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-orange-500">
              Module {moduleNumber}
            </span>
            <span className="font-semibold text-navy-800 dark:text-white">
              {module.title}
            </span>
            <span className="text-sm text-gray-500">
              ({module.lessons.length} lessons)
            </span>
            {!isEnrolled && (
              <Lock size={16} className="text-gray-400 ml-2" />
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="space-y-2 mt-2">
            {module.lessons
              .sort((a, b) => a.order - b.order)
              .map((lesson) => (
                isEnrolled ? (
                  <Link
                    key={lesson.id}
                    href={`/${locale}/courses/${courseId}/modules/${module.id}/lessons/${lesson.id}`}
                  >
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        {getLessonIcon(lesson.type)}
                        <span className="text-gray-700 dark:text-gray-200">
                          {lesson.title}
                        </span>
                      </div>
                      <Button size="sm" variant="ghost" className="text-orange-500">
                        <PlayCircle size={18} />
                      </Button>
                    </div>
                  </Link>
                ) : (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-navy-900 opacity-60 cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3">
                      {getLessonIcon(lesson.type)}
                      <span className="text-gray-700 dark:text-gray-200">
                        {lesson.title}
                      </span>
                    </div>
                    <Lock size={16} className="text-gray-400" />
                  </div>
                )
              ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
