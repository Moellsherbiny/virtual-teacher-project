"use client";
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Trash2, MoreHorizontal, FileText } from "lucide-react";
import type { Course } from "@/types/course";

interface CourseTableProps {
  courses: Course[];
  onEdit: (id: string) => void;
  onDelete: (course: Course) => void;
  t: any; // translations
}

export function CourseTable({ courses, onEdit, onDelete, t }: CourseTableProps) {
  const columns: ColumnDef<Course>[] = useMemo(() => [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("table.title")}
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "instructorName",
      header: t("table.instructor"),
      cell: ({ row }) => <div className="text-sm">{row.original.instructorName}</div>,
    },
    {
      accessorKey: "modulesCount",
      header: t("table.modules"),
      cell: ({ row }) => <div>{row.original.modulesCount}</div>,
    },
    {
      accessorKey: "enrollmentCount",
      header: t("table.enrollments"),
      cell: ({ row }) => <div>{row.original.enrollmentCount}</div>,
    },
    {
      id: "actions",
      header: t("table.actions"),
      cell: ({ row }) => {
        const course = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("table.actionsFor")}</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEdit(course.id)}>
                <Edit className="mr-2 h-4 w-4" /> {t("table.edit")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(course)} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" /> {t("table.delete")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" /> {t("table.viewDetails")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [t, onEdit, onDelete]);

  return <DataTable columns={columns} data={courses} />;
}
