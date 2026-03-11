// ============= Manage Companies Page (Platform Owner — View & Manage Only) =============
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
import { Search, Briefcase, Users, Award, Building2, Pencil, Trash2, Eye, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { fetchManagedCompanies, updateManagedCompany, deleteManagedCompany } from "@/services/managedCompanies";
import type { ManagedCompany } from "@/services/managedCompanies";

export default function ManageCompanies() {
  const { canEdit, canDelete, isViewOnly } = useRoleAccess("platform");
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<ManagedCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editItem, setEditItem] = useState<ManagedCompany | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", city: "", email: "", phone: "", website: "", industry: "" });

  useEffect(() => {
    setLoading(true);
    fetchManagedCompanies({ search }).then((res) => {
      setCompanies(res.data);
      setLoading(false);
    });
  }, [search]);

  const openEdit = (item: ManagedCompany) => {
    setEditItem(item);
    setForm({ name: item.name, city: item.city, email: item.email, phone: item.phone, website: item.website, industry: item.industry });
  };

  const handleSave = async () => {
    if (!form.name || !form.email || !editItem) return;
    const res = await updateManagedCompany(editItem.id, form);
    setCompanies((prev) => prev.map((c) => (c.id === editItem.id ? res.data : c)));
    toast({ title: "Company updated", description: `${form.name} has been updated.` });
    setEditItem(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteManagedCompany(deleteId);
    setCompanies((prev) => prev.filter((c) => c.id !== deleteId));
    toast({ title: "Company removed" });
    setDeleteId(null);
  };

  const toggleStatus = async (item: ManagedCompany) => {
    const newStatus = item.status === "active" ? "suspended" : "active";
    const res = await updateManagedCompany(item.id, { status: newStatus });
    setCompanies((prev) => prev.map((c) => (c.id === item.id ? res.data : c)));
    toast({ title: `Company ${newStatus}`, description: `${item.name} is now ${newStatus}.` });
  };

  const statusVariant = (s: string) => {
    switch (s) { case "active": return "success" as const; case "suspended": return "destructive" as const; default: return "warning" as const; }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Companies"
        description="View and manage all registered companies on the platform"
        actions={
          <Button variant="outline" onClick={() => navigate("/companies/applications")}>
            <FileText className="w-4 h-4 mr-1" /> View All Applications
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Companies", value: companies.length, icon: Building2 },
          { label: "Active", value: companies.filter((c) => c.status === "active").length, icon: Award },
          { label: "Total Vacancies", value: companies.reduce((s, c) => s + c.vacancyCount, 0), icon: Briefcase },
          { label: "Total Hired", value: companies.reduce((s, c) => s + c.hiredCount, 0), icon: Users },
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
        <Input placeholder="Search companies..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Loading...</div>
      ) : (
        <DataTable headers={["Company", "Industry", "Vacancies", "Applicants", "Hired", "Plan", "Status", ...(isViewOnly ? [] : ["Actions"])]}>
          {companies.map((item) => (
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
              <td className="px-4 py-3 text-sm">{item.industry}</td>
              <td className="px-4 py-3 text-sm font-medium">{item.vacancyCount}</td>
              <td className="px-4 py-3 text-sm">{item.applicantCount.toLocaleString()}</td>
              <td className="px-4 py-3 text-sm font-medium text-success">{item.hiredCount}</td>
              <td className="px-4 py-3"><StatusBadge variant={item.plan === "premium" ? "success" : item.plan === "basic" ? "info" : "default"}>{item.plan}</StatusBadge></td>
              <td className="px-4 py-3"><StatusBadge variant={statusVariant(item.status)}>{item.status}</StatusBadge></td>
              {!isViewOnly && (
                <td className="px-4 py-3">
                  <ActionMenu actions={[
                    { label: "View Applications", icon: FileText, onClick: () => navigate(`/companies/applications?company=${item.id}`) },
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

      {!loading && companies.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">No companies found</div>
      )}

      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Edit Company</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div><Label>Name</Label><Input className="mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Company name" /></div>
            <div><Label>Industry</Label><Input className="mt-1" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="Technology" /></div>
            <div><Label>City</Label><Input className="mt-1" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" /></div>
            <div><Label>Email</Label><Input className="mt-1" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="careers@company.com" /></div>
            <div><Label>Phone</Label><Input className="mt-1" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 234-567-8900" /></div>
            <div><Label>Website</Label><Input className="mt-1" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="company.com" /></div>
            <Button className="w-full" onClick={handleSave} disabled={!form.name || !form.email}>{editItem ? "Save Changes" : "Create Company"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)} title="Delete Company" description="This will permanently remove the company and all associated data." onConfirm={handleDelete} variant="destructive" />
    </div>
  );
}
