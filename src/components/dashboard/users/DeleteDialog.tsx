import { useState } from "react";
import { Dialog, DialogContent, DialogHeader,DialogClose , DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/lib/apiHandler";
import { User } from "@/types/user";
import { Edit, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Alert } from "@/components/ui/alert";

export default function UserEditDialog({user}:{user:User}) {


  const [loading, setLoading] = useState(false);
  const t = useTranslations("dashboard.UserManagement");
  const handleSave = async () => {
    try {
      setLoading(true);
      toast.loading("Saving user...");

      const res = await api.delete(`/admin/users/${user.id}`);

      toast.dismiss();
      toast.success("User updated successfully");
      setLoading(false);
    } catch (err) {
      toast.dismiss();
      // toast.error(err?.response?.data?.message || "Failed to update user");
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Trash2 className="me-2 h-4 w-4" /> {t("table.delete")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <Alert variant="destructive">
          
        </Alert>
        <DialogFooter>
          <DialogClose />
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
