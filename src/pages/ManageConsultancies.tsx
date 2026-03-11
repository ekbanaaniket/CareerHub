// ============= Manage Consultancies Page (Platform Owner — View & Manage Only) =============
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ActionMenu } from "@/components/common/ActionMenu";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { Search, Globe, Users, UserCheck, Award, Pencil, Trash2, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { fetchManagedConsultancies, updateManagedConsultancy, deleteManagedConsultancy } from "@/services/managedConsultancies";
import type { ManagedConsultancy } from "@/services/managedConsultancies";

export default function ManageConsultancies() {
  const { canEdit, canDelete, isViewOnly } = useRoleAccess("platform");
  const [consultancies, setConsultancies] = useState<ManagedConsultancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editItem, setEditItem] = useState<ManagedConsultancy | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", city: "", email: "", phone: "", website: "" });

  useEffect(() => {
    setLoading(true);
    fetchManagedConsultancies({ search }).then((res) => {
      setConsultancies(res.data);
      setLoading(false);
    });
  }, [search]);

  const openEdit = (item: ManagedConsultancy) => {
    setEditItem(item);
    setForm({ name: item.name, city: item.city, email: item.email, phone: item.phone, website: item.website });
  };

  const handleSave = async () => {
    if (!form.name || !form.email || !editItem) return;
    const res = await updateManagedConsultancy(editItem.id, form);
    setConsultancies((prev) => prev.map((c) => (c.id === editItem.id ? res.data : c)));
    toast({ title: "Consultancy updated", description: `${form.name} has been updated.` });
    setEditItem(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteManagedConsultancy(deleteId);
    setConsultancies((prev) => prev.filter((c) => c.id !== deleteId));
    toast({ title: "Consultancy removed" });
    setDeleteId(null);
  };

  const toggleStatus = async (item: ManagedConsultancy) => {
    const newStatus = item.status === "active" ? "suspended" : "active";
    const res = await updateManagedConsultancy(item.id, { status: newStatus });
    setConsultancies((prev) => prev.map((c) => (c.id === item.id ? res.data : c)));
    toast({ title: `Consultancy ${newStatus}`, description: `${item.name} is now ${newStatus}.` });
  };

  const statusVariant = (s: string) => {
    switch (s) { case "active": return "success" as const; case "suspended": return "destructive" as const; default: return "warning" as const; }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Consultancies"
        description="View and manage all registered consultancies on the platform"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Consultancies", value: consultancies.length, icon: Globe },
          { label: "Active", value: consultancies.filter((c) => c.status === "active").length, icon: Award },
          { label: "Total Students", value: consultancies.reduce((s, c) => s + c.studentCount, 0), icon: Users },
          { label: "Total Counselors", value: consultancies.reduce((s, c) => s + c.counselorCount, 0), icon: UserCheck },
        ].map((s) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-4">
            <div className="flex items-center justify-between mb-2"><s.icon className="w-5 h-5 text-primary" /></div>
            <p className="text-2xl font-bold font-display">{s.value.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search consultancies..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Loading...</div>
      ) : (
        <DataTable headers={["Consultancy", "Email", "Students", "Counselors", "Success Rate", "Plan", "Status", ...(isViewOnly ? [] : ["Actions"])]}>
          {consultancies.map((item) => (
            <tr key={item.id} className="hover:bg-secondary/30 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-xs shrink-0">{item.logo}</div>
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.city}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm">{item.email}</td>
              <td className="px-4 py-3 text-sm font-medium">{item.studentCount.toLocaleString()}</td>
              <td className="px-4 py-3 text-sm">{item.counselorCount}</td>
              <td className="px-4 py-3 text-sm font-medium text-success">{item.visaSuccessRate > 0 ? `${item.visaSuccessRate}%` : "—"}</td>
              <td className="px-4 py-3"><StatusBadge variant={item.plan === "premium" ? "success" : item.plan === "basic" ? "info" : "default"}>{item.plan}</StatusBadge></td>
              <td className="px-4 py-3"><StatusBadge variant={statusVariant(item.status)}>{item.status}</StatusBadge></td>
              {!isViewOnly && (
                <td className="px-4 py-3">
                  <ActionMenu actions={[
                    ...(canEdit ? [{ label: "Edit", icon: Pencil, onClick: () => openEdit(item) }] : []),
                    ...(canEdit ? [{ label: item.status === "active" ? "Suspend" : "Activate", icon: Eye, onClick: () => toggleStatus(item) }] : []),
                    ...(canDelete ? [{ label: "Delete", icon: Trash2, onClick: () => setDeleteId(item.id), variant: "destructive" as const }] : []),
                  ]} />
                </td>
              )}
            </tr>
          ))}
        </DataTable>
      )}

      {!loading && consultancies.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">No consultancies found</div>
      )}

      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Edit Consultancy</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div><Label>Name</Label><Input className="mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Consultancy name" /></div>
            <div><Label>City</Label><Input className="mt-1" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" /></div>
            <div><Label>Email</Label><Input className="mt-1" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="admin@consultancy.com" /></div>
            <div><Label>Phone</Label><Input className="mt-1" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 234-567-8900" /></div>
            <div><Label>Website</Label><Input className="mt-1" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="consultancy.com" /></div>
            <Button className="w-full" onClick={handleSave} disabled={!form.name || !form.email}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)} title="Delete Consultancy" description="This will permanently remove the consultancy and all associated data." onConfirm={handleDelete} variant="destructive" />
    </div>
  );
}