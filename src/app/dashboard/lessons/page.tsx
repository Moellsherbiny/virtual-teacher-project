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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Lesson {
  id: string;
  title: string;
  content: string | null;
  videoUrl: string | null;
  fileUrl: string | null;
  order: number;
  type: 'VIDEO' | 'TEXT' | 'MATERILAS';
  moduleId: string;
  module: {
    id: string;
    title: string;
    course: {
      id: string;
      title: string;
    };
  };
}

interface Module {
  id: string;
  title: string;
  course: {
    title: string;
  };
}

export default function LessonsPage() {
  const t = useTranslations("courseAdmin");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    videoUrl: '',
    fileUrl: '',
    order: 0,
    type: 'VIDEO' as 'VIDEO' | 'TEXT' | 'MATERILAS',
    moduleId: '',
  });

  useEffect(() => {
    fetchLessons();
    fetchModules();
  }, []);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/lessons');
      setLessons(response.data);
    } catch (error) {
      toast.error(t('lessons.createError'));
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async () => {
    try {
      const response = await axios.get('/api/admin/modules');
      setModules(response.data);
    } catch (error) {
      console.error('Failed to fetch modules');
    }
  };

  const handleOpenDialog = (lesson?: Lesson) => {
    if (lesson) {
      setCurrentLesson(lesson);
      setFormData({
        title: lesson.title,
        content: lesson.content || '',
        videoUrl: lesson.videoUrl || '',
        fileUrl: lesson.fileUrl || '',
        order: lesson.order,
        type: lesson.type,
        moduleId: lesson.moduleId,
      });
    } else {
      setCurrentLesson(null);
      setFormData({
        title: '',
        content: '',
        videoUrl: '',
        fileUrl: '',
        order: 0,
        type: 'VIDEO',
        moduleId: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (currentLesson) {
        await axios.patch(`/api/admin/lessons/${currentLesson.id}`, formData);
        toast.success(t('lessons.updateSuccess'));
      } else {
        await axios.post('/api/admin/lessons', formData);
        toast.success(t('lessons.createSuccess'));
      }
      setIsDialogOpen(false);
      fetchLessons();
    } catch (error) {
      toast.error(
        currentLesson ? t('lessons.updateError') : t('lessons.createError')
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await axios.delete(`/api/admin/lessons/${deleteId}`);
      toast.success(t('lessons.deleteSuccess'));
      setIsDeleteDialogOpen(false);
      fetchLessons();
    } catch (error) {
      toast.error(t('lessons.deleteError'));
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          {t('lessons.title')}
        </h1>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('lessons.addLesson')}
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
                <TableHead>{t('lessons.lessonTitle')}</TableHead>
                <TableHead>{t('lessons.module')}</TableHead>
                <TableHead>{t('courses.title')}</TableHead>
                <TableHead>{t('lessons.type')}</TableHead>
                <TableHead>{t('lessons.order')}</TableHead>
                <TableHead>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lessons.map((lesson) => (
                <TableRow key={lesson.id}>
                  <TableCell className="font-medium">{lesson.title}</TableCell>
                  <TableCell>{lesson.module.title}</TableCell>
                  <TableCell>{lesson.module.course.title}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                      {t(`lessons.types.${lesson.type}`)}
                    </span>
                  </TableCell>
                  <TableCell>{lesson.order}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOpenDialog(lesson)}
                        className="text-navy-700 hover:bg-navy-50 dark:text-navy-300"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setDeleteId(lesson.id);
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
        <DialogContent className="bg-white dark:bg-slate-800 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentLesson ? t('lessons.editLesson') : t('lessons.addLesson')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{t('lessons.lessonTitle')}</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label>{t('lessons.module')}</Label>
              <Select
                value={formData.moduleId}
                onValueChange={(value) =>
                  setFormData({ ...formData, moduleId: value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((module) => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.title} - {module.course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t('lessons.type')}</Label>
              <Select
                value={formData.type}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIDEO">{t('lessons.types.VIDEO')}</SelectItem>
                  <SelectItem value="TEXT">{t('lessons.types.TEXT')}</SelectItem>
                  <SelectItem value="MATERILAS">{t('lessons.types.MATERILAS')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t('lessons.content')}</Label>
              <Textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="mt-1"
                rows={4}
              />
            </div>
            <div>
              <Label>{t('lessons.videoUrl')}</Label>
              <Input
                value={formData.videoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, videoUrl: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label>{t('lessons.fileUrl')}</Label>
              <Input
                value={formData.fileUrl}
                onChange={(e) =>
                  setFormData({ ...formData, fileUrl: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label>{t('lessons.order')}</Label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) })
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
            <AlertDialogTitle>{t('lessons.deleteLesson')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('lessons.deleteConfirm')}
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