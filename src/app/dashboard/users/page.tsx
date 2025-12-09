"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { PlusCircle, Edit, Trash2, ArrowUpDown, MoreHorizontal, Mail, User as UserIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner"
import api from "@/lib/apiHandler";

// Shadcn/ui components
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
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // For displaying the role
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "@/types/user"
import UserEditDialog from "@/components/dashboard/users/EditDialog";
import DeleteDialog from "@/components/dashboard/users/DeleteDialog";
import ResetPassDialog from "@/components/dashboard/users/resetPassDialog";
// --- USER DATA STRUCTURE ---


// --- DATA FETCHING LOGIC ---
export default function UserManagementPage() {
  const t = useTranslations("dashboard.UserManagement");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await api.get("admin/users");
        setUsers(result.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handler functions for actions
  const handleEdit = (userId: string) => {
    console.log("Edit user:", userId);
    // TODO: Open Edit User Modal
  };
  const handleDelete = (userId: string) => {
    console.log("Delete user:", userId);
    // TODO: Implement deletion confirmation dialog and API call
  };
  const handleCreate = () => {
    console.log("Create new user");
    // TODO: Open Create User Modal
  };

  // Helper function to get role badge style
  const getRoleBadge = (role: User['role']) => {
    const roleKey = role.toLowerCase() as Lowercase<User['role']>;
    const label = t(`roles.${roleKey}`);

    let className = "";
    if (role === 'ADMIN') {
      className = "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white";
    } else if (role === 'TEACHER') {
      className = "bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white";
    } else { // STUDENT
      className = "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white";
    }

    return <Badge className={className}>{label}</Badge>;
  };

  // --- COLUMN DEFINITIONS (Data Table) ---
  const columns: ColumnDef<User>[] = useMemo(() => [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("table.name")}
          <ArrowUpDown className="ms-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium flex items-center"><UserIcon className="h-4 w-4 me-2 text-gray-500 dark:text-gray-400" />{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: t("table.email"),
      cell: ({ row }) => <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center"><Mail className="h-4 w-4 me-2" />{row.original.email}</div>,
    },
    {
      accessorKey: "role",
      header: t("table.role"),
      cell: ({ row }) => {
        const user = row.original;

        return getRoleBadge(user.role);
      },
    }, {
      id: "actions",
      header: t("table.actions"),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu >
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">{t("table.openMenu")}</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="dark:bg-gray-800">
              <DropdownMenuLabel>{t("table.actionsFor")}</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => handleEdit(user.id)}
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer flex items-center"
              >
                <UserEditDialog user={user} />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(user.id)}
                onSelect={(e) => e.preventDefault()}
                className="text-red-600 dark:text-red-400 cursor-pointer flex items-center"
              >
                <DeleteDialog user={user} />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer flex items-center">
                <ResetPassDialog user={user} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [t]);


  // --- RENDER LOGIC ---
  return (
    <div className="space-y-6 p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-extrabold text-blue-950 dark:text-gray-100">
          {t("header")}
        </h1>
        <Button
          onClick={handleCreate}
          className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold flex items-center"
        >
          <PlusCircle className="h-5 w-5 me-2" />
          {t("createNew")}
        </Button>
      </div>

      <Card className="shadow-lg dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-blue-950 dark:text-gray-200">
            {t("cardTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            // Skeleton loader for table
            <div className="space-y-3">
              <Skeleton className="h-10 w-full bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-10 w-full bg-gray-100 dark:bg-gray-800" />
              <Skeleton className="h-10 w-full bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-10 w-full bg-gray-100 dark:bg-gray-800" />
              <Skeleton className="h-10 w-full bg-gray-200 dark:bg-gray-700" />
            </div>
          ) : (
            <DataTable columns={columns} data={users} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}