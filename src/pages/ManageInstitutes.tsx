// ============= Manage Institutes Page (Platform Owner — View & Manage Only) =============
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ActionMenu } from "@/components/common/ActionMenu";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { Search, Building2, Users, GraduationCap, Globe, Pencil, Trash2, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { fetchManagedInstitutes, updateManagedInstitute, deleteManagedInstitute } from "@/services/managedInstitutes";
import type { ManagedInstitute } from "@/services/managedInstitutes";

const planColors: Record<string, "default" | "success" | "info" | "warning"> = {
  free: "default",
  basic: "info",
  premium: "success",
};

export default function ManageInstitutes() {
  const { canEdit, canDelete, isViewOnly } = useRoleAccess("platform");
  const [institutes, setInstitutes] = useState<ManagedInstitute[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editInst, setEditInst] = useState<ManagedInstitute | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", city: "", email: "", phone: "", website: "" });

  useEffect(() => {
    setLoading(true);
    fetchManagedInstitutes({ search }).then((res) => {
      setInstitutes(res.data);
      setLoading(false);
    });
  }, [search]);

  const openEdit = (inst: ManagedInstitute) => {
    setEditInst(inst);
    setForm({ name: inst.name, city: inst.city, email: inst.email, phone: inst.phone, website: inst.website });
  };

  const handleSave = async () => {
    if (!form.name || !form.email || !editInst) return;
    const res = await updateManagedInstitute(editInst.id, form);
    setInstitutes((prev) => prev.map((i) => i.id === editInst.id ? res.data : i));
    toast({ title: "Institute updated", description: `${form.name} has been updated.` });
    setEditInst(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteManagedInstitute(deleteId);
    setInstitutes((prev) => prev.filter((i) => i.id !== deleteId));
    toast({ title: "Institute removed", description: "The institute has been removed from the platform." });
    setDeleteId(null);
  };

  const toggleStatus = async (inst: ManagedInstitute) => {
    const newStatus = inst.status === "active" ? "suspended" : "active";
    const res = await updateManagedInstitute(inst.id, { status: newStatus });
    setInstitutes((prev) => prev.map((i) => i.id === inst.id ? res.data : i));
    toast({ title: `Institute ${newStatus}`, description: `${inst.name} is now ${newStatus}.` });
  };

  const statusVariant = (s: string) => {
    switch (s) { case "active": return "success" as const; case "suspended": return "destructive" as const; default: return "warning" as const; }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Institutes"
        description="View and manage all registered institutes on the platform"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Institutes", value: institutes.length, icon: Building2 },
          { label: "Active", value: institutes.filter((i) => i.status === "active").length, icon: Globe },
          { label: "Total Students", value: institutes.reduce((s, i) => s + i.studentCount, 0), icon: Users },
          { label: "Total Courses", value: institutes.reduce((s, i) => s + i.courseCount, 0), icon: GraduationCap },
        ].map((s) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-4">
            <div className="flex items-center justify-between mb-2">
              <s.icon className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold font-display">{s.value.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search institutes..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Loading...</div>
      ) : (
        <DataTable headers={["Institute", "Email", "Students", "Courses", "Instructors", "Plan", "Status", ...(isViewOnly ? [] : ["Actions"])]}>
          {institutes.map((inst) => (
            <tr key={inst.id} className="hover:bg-secondary/30 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-xs shrink-0">
                    {inst.logo}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{inst.name}</p>
                    <p className="text-xs text-muted-foreground">{inst.city}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm">{inst.email}</td>
              <td className="px-4 py-3 text-sm font-medium">{inst.studentCount.toLocaleString()}</td>
              <td className="px-4 py-3 text-sm">{inst.courseCount}</td>
              <td className="px-4 py-3 text-sm">{inst.instructorCount}</td>
              <td className="px-4 py-3"><StatusBadge variant={planColors[inst.plan]}>{inst.plan}</StatusBadge></td>
              <td className="px-4 py-3"><StatusBadge variant={statusVariant(inst.status)}>{inst.status}</StatusBadge></td>
              {!isViewOnly && (
                <td className="px-4 py-3">
                  <ActionMenu
                    actions={[
                      ...(canEdit ? [{ label: "Edit", icon: Pencil, onClick: () => openEdit(inst) }] : []),
                      ...(canEdit ? [{ label: inst.status === "active" ? "Suspend" : "Activate", icon: Eye, onClick: () => toggleStatus(inst) }] : []),
                      ...(canDelete ? [{ label: "Delete", icon: Trash2, onClick: () => setDeleteId(inst.id), variant: "destructive" as const }] : []),
                    ]}
                  />
                </td>
              )}
            </tr>
          ))}
        </DataTable>
      )}

      {!loading && institutes.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">No institutes found</div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editInst} onOpenChange={(open) => !open && setEditInst(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Edit Institute</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div><Label>Name</Label><Input className="mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Institute name" /></div>
            <div><Label>City</Label><Input className="mt-1" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" /></div>
            <div><Label>Email</Label><Input className="mt-1" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="admin@institute.com" /></div>
            <div><Label>Phone</Label><Input className="mt-1" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 234-567-8900" /></div>
            <div><Label>Website</Label><Input className="mt-1" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="institute.com" /></div>
            <Button className="w-full" onClick={handleSave} disabled={!form.name || !form.email}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Institute"
        description="This will permanently remove the institute and all associated data. This action cannot be undone."
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}