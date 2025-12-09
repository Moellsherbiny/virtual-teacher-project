"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/apiHandler";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  PlusCircle,
  GripVertical,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  BookOpen,
} from "lucide-react";

// import CreateModuleDialog from "./_dialogs/CreateModuleDialog";
// import EditModuleDialog from "./_dialogs/EditModuleDialog";
// import CreateLessonDialog from "./_dialogs/CreateLessonDialog";
// import EditLessonDialog from "./_dialogs/EditLessonDialog";

export default function ModulesPage() {
  const { courseId } = useParams();
  const [modules, setModules] = useState([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  // dialogs
  const [createModuleOpen, setCreateModuleOpen] = useState(false);
  const [editModule, setEditModule] = useState(null);

  const [createLesson, setCreateLesson] = useState(null); // moduleId
  const [editLesson, setEditLesson] = useState(null); // lesson object

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/course/${courseId}/module`);
      setModules(res.data.modules);
    } catch {
      console.log("Failed loading modules");
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [courseId]);

const toggle = (id: string) =>
  setExpanded((prev) => ({
    ...prev,
    [id]: prev[id] ? false : true,
  }));

  if (loading)
    return <p className="p-4">Loading modules...</p>;

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Modules</h1>
        <Button onClick={() => setCreateModuleOpen(true)}>
          <PlusCircle className="w-4 h-4 mr-2" /> Add Module
        </Button>
      </div>

      {modules.length === 0 && (
        <div className="text-center p-10 border rounded bg-muted/30">
          <BookOpen className="w-12 mx-auto text-muted-foreground" />
          <p className="mt-2 font-medium">No modules found</p>
          <p className="text-sm text-muted-foreground">
            Start by creating your first module.
          </p>
        </div>
      )}

      {modules.map((m: any) => (
        <Card key={m.id} className="border-l-4 border-sky-500">
          <CardHeader className="flex flex-row justify-between items-center">
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-muted-foreground" />
              <button onClick={() => toggle(m.id)} className="flex items-center">
                {expanded[m.id] ? (
                  <ChevronDown className="w-4 h-4 mr-1" />
                ) : (
                  <ChevronRight className="w-4 h-4 mr-1" />
                )}
                <span className="font-semibold">{m.order}. {m.title}</span>
              </button>
            </div>

            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={() => setEditModule(m)}>
                <Edit className="w-4 h-4" />
              </Button>

              <Button size="sm" variant="outline" onClick={() => console.log("Delete module", m.id)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>

              <Button size="sm" onClick={() => setCreateLesson(m.id)}>
                <PlusCircle className="w-4 h-4 mr-1" /> Add Lesson
              </Button>
            </div>
          </CardHeader>

          {expanded[m.id] && (
            <CardContent>
              <Separator className="my-2" />

              {m.lessons.length === 0 ? (
                <p className="text-sm text-muted-foreground px-4 py-2">
                  No lessons yet
                </p>
              ) : (
                m.lessons.map((l: any) => (
                  <div
                    key={l.id}
                    className="flex items-center justify-between px-4 py-2 border-b"
                  >
                    <div className="flex gap-3 items-center">
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                      <span>{l.order}. {l.title}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditLesson(l)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => console.log("Delete lesson", l.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          )}
        </Card>
      ))}

      {/* dialogs */}
      {/* <CreateModuleDialog open={createModuleOpen} onClose={() => setCreateModuleOpen(false)} courseId={courseId} onCreated={load} /> */}
      {/* <EditModuleDialog open={!!editModule} moduleData={editModule} onClose={() => setEditModule(null)} onUpdated={load} /> */}

      {/* <CreateLessonDialog open={!!createLesson} moduleId={createLesson} onClose={() => setCreateLesson(null)} onCreated={load} /> */}
      {/* <EditLessonDialog open={!!editLesson} lessonData={editLesson} onClose={() => setEditLesson(null)} onUpdated={load} /> */}
    </div>
  );
}
