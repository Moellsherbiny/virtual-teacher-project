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
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Module {
  id: string;
  title: string;
  order: number;
  courseId: string;
  course: {
    id: string;
    title: string;
  };
  lessons: any[];
}

interface Course {
  id: string;
  title: string;
}

export default function ModulesPage() {
  const t = useTranslations("courseAdmin");
  const [modules, setModules] = useState<Module[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    order: 0,
    courseId: '',
  });

  useEffect(() => {
    fetchModules();
    fetchCourses();
  }, []);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/modules');
      setModules(response.data);
    } catch (error) {
      toast.error(t('modules.createError'));
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/admin/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to fetch courses');
    }
  };

  const handleOpenDialog = (module?: Module) => {
    if (module) {
      setCurrentModule(module);
      setFormData({
        title: module.title,
        order: module.order,
        courseId: module.courseId,
      });
    } else {
      setCurrentModule(null);
      setFormData({
        title: '',
        order: 0,
        courseId: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (currentModule) {
        await axios.patch(`/api/admin/modules/${currentModule.id}`, formData);
        toast.success(t('modules.updateSuccess'));
      } else {
        await axios.post('/api/admin/modules', formData);
        toast.success(t('modules.createSuccess'));
      }
      setIsDialogOpen(false);
      fetchModules();
    } catch (error) {
      toast.error(
        currentModule ? t('modules.updateError') : t('modules.createError')
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await axios.delete(`/api/admin/modules/${deleteId}`);
      toast.success(t('modules.deleteSuccess'));
      setIsDeleteDialogOpen(false);
      fetchModules();
    } catch (error) {
      toast.error(t('modules.deleteError'));
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          {t('modules.title')}
        </h1>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('modules.addModule')}
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
                <TableHead>{t('modules.moduleTitle')}</TableHead>
                <TableHead>{t('modules.course')}</TableHead>
                <TableHead>{t('modules.order')}</TableHead>
                <TableHead>{t('modules.lessons')}</TableHead>
                <TableHead>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modules.map((module) => (
                <TableRow key={module.id}>
                  <TableCell className="font-medium">{module.title}</TableCell>
                  <TableCell>{module.course.title}</TableCell>
                  <TableCell>{module.order}</TableCell>
                  <TableCell>{module.lessons.length}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOpenDialog(module)}
                        className="text-navy-700 hover:bg-navy-50 dark:text-navy-300"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setDeleteId(module.id);
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
              {currentModule ? t('modules.editModule') : t('modules.addModule')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{t('modules.moduleTitle')}</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label>{t('modules.course')}</Label>
              <Select
                value={formData.courseId}
                onValueChange={(value) =>
                  setFormData({ ...formData, courseId: value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t('modules.order')}</Label>
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
            <AlertDialogTitle>{t('modules.deleteModule')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('modules.deleteConfirm')}
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