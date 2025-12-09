
'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Course {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  instructorId: string;
  createdAt: string;
  instructor: {
    id: string;
    name: string;
    email: string;
  };
  _count?: {
    modules: number;
    enrollments: number;
  };
}

export default function CoursesPage() {
  const t = useTranslations("courseAdmin");
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    instructorId: '',
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/courses');
      setCourses(response.data);
    } catch (error) {
      toast.error(t('courses.createError'));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (course?: Course) => {
    if (course) {
      setCurrentCourse(course);
      setFormData({
        title: course.title,
        description: course.description || '',
        imageUrl: course.imageUrl || '',
        instructorId: course.instructorId,
      });
    } else {
      setCurrentCourse(null);
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        instructorId: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (currentCourse) {
        await axios.patch(`/api/admin/courses/${currentCourse.id}`, formData);
        toast.success(t('courses.updateSuccess'));
      } else {
        await axios.post('/api/admin/courses', formData);
        toast.success(t('courses.createSuccess'));
      }
      setIsDialogOpen(false);
      fetchCourses();
    } catch (error) {
      toast.error(
        currentCourse ? t('courses.updateError') : t('courses.createError')
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await axios.delete(`/api/admin/courses/${deleteId}`);
      console.log(res);
      toast.success(t('courses.deleteSuccess'));
      setIsDeleteDialogOpen(false);
      fetchCourses();
    } catch (error) {
      toast.error(t('courses.deleteError'));
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          {t('courses.title')}
        </h1>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('courses.addCourse')}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-900">
                <TableHead>{t('courses.courseTitle')}</TableHead>
                <TableHead>{t('courses.instructor')}</TableHead>
                <TableHead>{t('courses.modules')}</TableHead>
                <TableHead>{t('courses.enrollments')}</TableHead>
                <TableHead>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>{course.instructor.name}</TableCell>
                  <TableCell>{course._count?.modules || 0}</TableCell>
                  <TableCell>{course._count?.enrollments || 0}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.push(`/dashboard/courses/${course.id}`)}
                        className="text-navy-700 hover:bg-navy-50 dark:text-navy-300"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setDeleteId(course.id);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white dark:bg-slate-800">
          <DialogHeader>
            <DialogTitle>
              {currentCourse ? t('courses.editCourse') : t('courses.addCourse')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{t('courses.courseTitle')}</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label>{t('courses.description')}</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label>{t('courses.imageUrl')}</Label>
              <Input
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label>{t('courses.instructor')}</Label>
              <Input
                value={formData.instructorId}
                onChange={(e) =>
                  setFormData({ ...formData, instructorId: e.target.value })
                }
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="bg-white dark:bg-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('courses.deleteCourse')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('courses.deleteConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}