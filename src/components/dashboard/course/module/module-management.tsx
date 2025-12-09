'use client';

import * as React from 'react';
import { Module, Lesson } from '@/types/course';
import { useTranslations } from 'next-intl';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogFooter 
} from '@/components/ui/dialog';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import LessonCreateDialog from '../lesson/AddLessonDialog';
import { Label } from '@/components/ui/label';
import api from '@/lib/apiHandler';

interface ModuleManagementProps {
  courseId: string;
}

export function ModuleManagement({ courseId }: ModuleManagementProps) {
  const tModules = useTranslations('courseAdmin.modules');
  const tLessons = useTranslations('courseAdmin.lessons');
  const tCommon = useTranslations('courseAdmin.common');

  const [modules, setModules] = React.useState<Module[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [newModuleTitle, setNewModuleTitle] = React.useState('');
  const [order, setOrder] = React.useState<number>(0);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch(`/api/admin/modules?courseId=${courseId}`);
        const data = await response.json();
        setModules(data);
      } catch (error) {
        console.error("Failed to fetch modules:", error);
      }
      setIsLoading(false);
    };
    fetchModules();
  }, [courseId]);

  const handleCreateModule = async () => {
    if (!newModuleTitle.trim()) return;
    try {
      const res = api.post(`/admin/modules`, {
        title: newModuleTitle,
        courseId,
        order
      })
    }
      catch(err){
        console.log(err);
      }
    setNewModuleTitle('');
    setIsDialogOpen(false);
  };

  const handleEditModule = (moduleId: string, newTitle: string) => {
    console.log(`Editing module ${moduleId} to ${newTitle}`);
  };

  const handleDeleteModule = (moduleId: string) => {
    console.log(`Deleting module ${moduleId}`);
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> {tModules('addModule')}
        </Button>
      </div>

      <div className="space-y-4">
        {modules.map((module) => (
          <Card key={module.id} className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between bg-primary/10 p-4">
              <CardTitle className="text-xl">
                {module.order}. {module.title}
              </CardTitle>

              <div className="flex space-x-2">
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditModule(module.id, module.title)}
                >
                    <Edit className="h-4 w-4" />
                </Button>

                <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDeleteModule(module.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>

                  <LessonCreateDialog moduleId={module.id} />
                
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-2">
              <h4 className="text-lg font-semibold">{tLessons('title')}</h4>
              <Separator />

              {module.lessons.length === 0 ? (
                <p className="text-muted-foreground">{tCommon('noData')}</p>
              ) : (
                <ul className="space-y-1">
                  {module.lessons.map((lesson) => (
                    <li 
                        key={lesson.id} 
                        className="flex justify-between items-center p-2 rounded-md hover:bg-secondary/50 transition-colors"
                    >
                      <span className="text-sm">
                        {lesson.order}. ({lesson.type}) {lesson.title}
                      </span>

                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{tModules('addModule')}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Label>
              {tModules('moduleTitle')}
            </Label>
            <Input
              id="title"
              placeholder={tModules('moduleTitle')}
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              className="col-span-3"
            />
            <Label>
              {tModules('order')}
            </Label>
            <Input
              id="order"
              placeholder={tModules('order')}
              value={order}
              type="number"
              onChange={(e) => setOrder(parseInt(e.target.value ))}
              className="col-span-3"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {tCommon('cancel')}
            </Button>
            <Button onClick={handleCreateModule} disabled={!newModuleTitle.trim()}>
              {tCommon('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
