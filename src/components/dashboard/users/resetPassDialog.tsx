import { useState } from "react";
import { Dialog, DialogContent, DialogHeader,DialogClose , DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/lib/apiHandler";
import { User } from "@/types/user";
import { Edit, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ResetPassDialog({user}:{user:User}) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user.role);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("dashboard.UserManagement");
  const handleSave = async () => {
    try {
      setLoading(true);
      toast.loading("Saving user...");

      const res = await api.patch(`/admin/users/${user.id}`, {
        name,
        email,
        role,
      });

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
          <Mail className="me-2 h-4 w-4" /> {t("table.resetPassword")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Role</Label>
            <Select value={role} onValueChange={()=> setRole(role)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="STUDENT">STUDENT</SelectItem>
                <SelectItem value="TEACHER">TEACHER</SelectItem>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
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
