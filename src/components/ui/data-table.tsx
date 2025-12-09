
"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  // NOTE: Correcting translation namespace to use a simpler root key if possible, or ensure "dashboard.CourseManagement" is correct.
  const t = useTranslations("dashboard.CourseManagement"); 
  const lang = useLocale();
  
  // Determine direction
  const isRTL = lang === "ar";
  const dir = isRTL ? "rtl" : "ltr";

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="rounded-md border dark:border-gray-700">
      {/* 1. Set the overall direction on the <Table> element */}
      <Table dir={dir}> 
        
        {/* Table Header */}
        <TableHeader 
            // Apply background classes
            className="bg-gray-100 dark:bg-gray-700"
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow 
              key={headerGroup.id} 
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead 
                    key={header.id}
                    // Use standard text alignment utility classes
                    className={isRTL ? "text-right" : "text-left"}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        
        {/* Table Body */}
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="border-b dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell 
                    key={cell.id}
                    // Apply text alignment to the cell content
                    className={isRTL ? "text-right" : "text-left"}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell 
                colSpan={columns.length} 
                className="h-24 text-center"
              >
                {t("noResults")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}