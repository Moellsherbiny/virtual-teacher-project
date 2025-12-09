"use client"

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
// import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/use-toast'
import  api  from '@/lib/apiHandler'
import { 
  ArrowLeft, 
  CheckCircle, 
  Download, 
  Video, 
  FileText, 
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  Loader2,
  PlayCircle,
  BookOpen
} from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface Lesson {
  id: string
  title: string
  content: string | null
  videoUrl: string | null
  fileUrl: string | null
  type: 'VIDEO' | 'TEXT' | 'MATERILAS'
  order: number
  module: {
    id: string
    title: string
    order: number
    course: {
      id: string
      title: string
    }
    lessons: Array<{
      id: string
      title: string
      order: number
    }>
  }
}

export default function LessonPage({ 
  params 
}: { 
  params: Promise<{ courseId: string; moduleId: string; lessonId: string } >
}) {
  const t = useTranslations('course.lessons')
  const tCourses = useTranslations('course.courses')
  const tCommon = useTranslations('course.common')
  const { toast } = useToast()
  const [courseId, setCourseId] = useState<string | null>(null)
  const [moduleId, setModuleId] = useState<string | null>(null)
  const [lessonId, setLessonId] = useState<string | null>(null)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState(false)
  const [completionProgress, setCompletionProgress] = useState(0)
  const session = useSession()

  // TODO: Replace with actual user ID from auth context
  const userId = session.data?.user.id

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setCourseId((await params).courseId)
        setModuleId((await params).moduleId)
        setLessonId((await params).lessonId)
        const response = await api.get(`student/lessons/${lessonId}`)
        setLesson(response.data)
        
        // TODO: Check if lesson is completed for this user
        // const completionResponse = await api.get(`/progress/${userId}/${params.lessonId}`)
        // setCompleted(completionResponse.data.completed)
      } catch (error) {
        console.error('Failed to fetch lesson:', error)
        toast({
          variant: "destructive",
          title: t('errors.loadingFailed'),
          description: t('errors.general'),
        })
      } finally {
        setLoading(false)
      }
    }

    fetchLesson()
  }, [])

  const handleMarkComplete = async () => {
    try {
      // TODO: Call API to mark lesson as complete
      // await api.post('/progress', {
      //   userId,
      //   lessonId: params.lessonId,
      //   completed: !completed
      // })
      
      setCompleted(!completed)
      toast({
        title: tCommon('success'),
        description: completed ? "Lesson marked as incomplete" : "Lesson completed! Great job! 🎉",
      })
    } catch (error) {
      console.error('Failed to update progress:', error)
      toast({
        variant: "destructive",
        title: tCommon('error'),
        description: tCommon('errors.general'),
      })
    }
  }

  const getLessonTypeInfo = () => {
    if (!lesson) return { icon: FileText, label: 'Lesson', color: 'text-gray-500' }
    
    switch (lesson.type) {
      case 'VIDEO':
        return { icon: Video, label: t('videoLesson'), color: 'text-blue-500' }
      case 'TEXT':
        return { icon: FileText, label: t('textLesson'), color: 'text-green-500' }
      case 'MATERILAS':
        return { icon: FolderOpen, label: t('materials'), color: 'text-purple-500' }
      default:
        return { icon: FileText, label: 'Lesson', color: 'text-gray-500' }
    }
  }

  const getNavigationLessons = () => {
    if (!lesson) return { prev: null, next: null }
    
    const allLessons = lesson.module.lessons.sort((a, b) => a.order - b.order)
    const currentIndex = allLessons.findIndex(l => l.id === lesson.id)
    
    return {
      prev: currentIndex > 0 ? allLessons[currentIndex - 1] : null,
      next: currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null,
      current: currentIndex + 1,
      total: allLessons.length
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-navy-900">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
            <p className="text-gray-600 dark:text-gray-300">{tCommon('loading')}</p>
          </div>
        </div>
      </main>
    )
  }

  if (!lesson) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-navy-900">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <BookOpen className="mx-auto mb-4 text-gray-400" size={64} />
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              {t('errors.notFound')}
            </p>
            <Link href={`/courses`}>
              <Button className="bg-orange-500 hover:bg-orange-600">
                {tCommon('back')}
              </Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const typeInfo = getLessonTypeInfo()
  const Icon = typeInfo.icon
  const navigation = getNavigationLessons()

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-navy-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb Navigation */}
        <div className="mb-4">
          <Link href={`/courses/${lesson.module.course.id}`}>
            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
              <ArrowLeft size={16} className="mr-2" />
              {lesson.module.course.title}
            </Button>
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Lesson Header */}
              <div className="bg-white dark:bg-navy-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gray-100 dark:bg-navy-700 ${typeInfo.color}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <span className={`text-sm font-semibold ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                      <h1 className="text-2xl font-bold text-navy-800 dark:text-white">
                        {lesson.title}
                      </h1>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleMarkComplete}
                    variant={completed ? "default" : "outline"}
                    className={completed 
                      ? "bg-green-500 hover:bg-green-600 text-white" 
                      : "border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-navy-700"
                    }
                  >
                    <CheckCircle size={18} className="mr-2" />
                    {completed ? t('completed') : t('markComplete')}
                  </Button>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>{t('modules.moduleTitle')} {lesson.module.order}</span>
                    <span>{tCourses('lessons')} {navigation.current} / {navigation.total}</span>
                  </div>
                  {/* <Progress 
                    value={(navigation.current / navigation.total) * 100} 
                    className="h-2"
                  /> */}
                </div>
              </div>

              {/* Video Player */}
              {lesson.type === 'VIDEO' && lesson.videoUrl && (
                <div className="bg-black rounded-lg overflow-hidden shadow-xl">
                  <video
                    controls
                    controlsList="nodownload"
                    className="w-full aspect-video"
                    src={lesson.videoUrl}
                    poster="/video-placeholder.jpg"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {/* Text Content */}
              {(lesson.type === 'TEXT' || (lesson.content && lesson.type === 'VIDEO')) && lesson.content && (
                <div className="bg-white dark:bg-navy-800 rounded-lg p-8 shadow-lg">
                  <h2 className="text-xl font-bold text-navy-800 dark:text-white mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-orange-500" />
                    {lesson.type === 'TEXT' ? t('textLesson') : t('transcript')}
                  </h2>
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed text-lg">
                      {lesson.content}
                    </div>
                  </div>
                </div>
              )}

              {/* Materials Download */}
              {lesson.type === 'MATERILAS' && lesson.fileUrl && (
                <div className="bg-white dark:bg-navy-800 rounded-lg p-6 shadow-lg">
                  <h2 className="text-xl font-bold text-navy-800 dark:text-white mb-4 flex items-center gap-2">
                    <FolderOpen size={20} className="text-orange-500" />
                    {t('resources')}
                  </h2>
                  <div className="border-2 border-dashed border-gray-300 dark:border-navy-600 rounded-lg p-8 text-center">
                    <Download className="mx-auto mb-4 text-orange-500" size={48} />
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Course materials are available for download
                    </p>
                    <a
                      href={lesson.fileUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="bg-orange-500 hover:bg-orange-600">
                        <Download size={18} className="mr-2" />
                        {t('downloadMaterial')}
                      </Button>
                    </a>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="bg-white dark:bg-navy-800 rounded-lg p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  {navigation.prev ? (
                    <Link 
                      href={`/courses/${courseId}/modules/${moduleId}/lessons/${navigation.prev.id}`}
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full justify-start">
                        <ChevronLeft size={18} className="mr-2" />
                        <div className="text-left">
                          <div className="text-xs text-gray-500">{tCommon('previous')}</div>
                          <div className="font-semibold truncate">{navigation.prev.title}</div>
                        </div>
                      </Button>
                    </Link>
                  ) : (
                    <div className="flex-1" />
                  )}

                  {navigation.next ? (
                    <Link 
                      href={`/courses/${courseId}/modules/${moduleId}/lessons/${navigation.next.id}`}
                      className="flex-1 ml-4"
                    >
                      <Button variant="outline" className="w-full justify-end">
                        <div className="text-right">
                          <div className="text-xs text-gray-500">{tCommon('next')}</div>
                          <div className="font-semibold truncate">{navigation.next.title}</div>
                        </div>
                        <ChevronRight size={18} className="ml-2" />
                      </Button>
                    </Link>
                  ) : (
                    <div className="flex-1 ml-4 flex justify-end">
                      <Link href={`/courses/${courseId}`}>
                        <Button className="bg-orange-500 hover:bg-orange-600">
                          {tCommon('back')} to Course
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar - Module Lessons */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-navy-800 rounded-lg p-6 shadow-lg sticky top-4">
                <h3 className="text-lg font-bold text-navy-800 dark:text-white mb-4">
                  {lesson.module.title}
                </h3>
                
                <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {lesson.module.lessons
                    .sort((a, b) => a.order - b.order)
                    .map((l, index) => {
                      const isActive = l.id === lesson.id
                      return (
                        <Link
                          key={l.id}
                          href={`/courses/${courseId}/modules/${moduleId}/lessons/${l.id}`}
                        >
                          <div
                            className={`p-3 rounded-lg transition-all ${
                              isActive
                                ? 'bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-500'
                                : 'bg-gray-50 dark:bg-navy-700 hover:bg-gray-100 dark:hover:bg-navy-600 border-2 border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                isActive
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-gray-300 dark:bg-navy-600 text-gray-600 dark:text-gray-300'
                              }`}>
                                {isActive ? (
                                  <PlayCircle size={16} />
                                ) : (
                                  <span className="text-sm font-semibold">{index + 1}</span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate ${
                                  isActive
                                    ? 'text-orange-700 dark:text-orange-300'
                                    : 'text-gray-700 dark:text-gray-200'
                                }`}>
                                  {l.title}
                                </p>
                              </div>
                              {/* TODO: Add completion checkmark */}
                              {/* {isCompleted && (
                                <CheckCircle size={16} className="text-green-500" />
                              )} */}
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}