// ============= Registration Approvals — Platform Owner =============
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatCard } from "@/components/common/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CheckCircle, XCircle, Clock, Search, Building2, Globe, Briefcase, FileCheck } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { fetchRegistrations, updateRegistrationStatus } from "@/services/registration";
import type { RegistrationRequest } from "@/services/registration";

const ENTITY_ICONS = { institute: Building2, consultancy: Globe, company: Briefcase };
const ENTITY_COLORS = { institute: "bg-primary/10 text-primary", consultancy: "bg-emerald-500/10 text-emerald-600", company: "bg-amber-500/10 text-amber-600" };

export default function RegistrationApprovals() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selected, setSelected] = useState<RegistrationRequest | null>(null);

  const { data: registrations } = useQuery({
    queryKey: ["registrations", statusFilter],
    queryFn: () => fetchRegistrations({ status: statusFilter }),
    select: (res) => res.data,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "approved" | "rejected" }) =>
      updateRegistrationStatus(id, status),
    onSuccess: (res) => {
      toast.success(res.message);
      qc.invalidateQueries({ queryKey: ["registrations"] });
      setSelected(null);
    },
  });

  const filtered = (registrations || []).filter((r) => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.ownerName.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || r.entityType === typeFilter;
    return matchSearch && matchType;
  });

  const stats = {
    pending: (registrations || []).filter((r) => r.status === "pending").length,
    approved: (registrations || []).filter((r) => r.status === "approved").length,
    rejected: (registrations || []).filter((r) => r.status === "rejected").length,
    total: (registrations || []).length,
  };

  // Group by entity type
  const grouped = ["institute", "consultancy", "company"]
    .map((type) => ({
      type: type as RegistrationRequest["entityType"],
      items: filtered.filter((r) => r.entityType === type),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Registration Approvals"
        description="Review and approve entity registration requests"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Pending" value={String(stats.pending)} icon={<Clock className="w-5 h-5" />} change="Awaiting review" changeType="neutral" />
        <StatCard title="Approved" value={String(stats.approved)} icon={<CheckCircle className="w-5 h-5" />} change="Active entities" changeType="positive" />
        <StatCard title="Rejected" value={String(stats.rejected)} icon={<XCircle className="w-5 h-5" />} change="Declined" changeType="negative" />
        <StatCard title="Total" value={String(stats.total)} icon={<FileCheck className="w-5 h-5" />} change="All time" changeType="neutral" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name or owner..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="institute">Institutes</SelectItem>
            <SelectItem value="consultancy">Consultancies</SelectItem>
            <SelectItem value="company">Companies</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grouped list */}
      <div className="space-y-6">
        {grouped.map((group) => {
          const Icon = ENTITY_ICONS[group.type];
          return (
            <div key={group.type}>
              <h3 className="text-sm font-semibold font-display mb-3 flex items-center gap-2 text-primary capitalize">
                <div className={`w-6 h-6 rounded ${ENTITY_COLORS[group.type]} flex items-center justify-center`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                {group.type === "institute" ? "Institutes" : group.type === "consultancy" ? "Consultancies" : "Companies"}
                <span className="text-muted-foreground font-normal">({group.items.length})</span>
              </h3>
              <div className="space-y-2">
                {group.items.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-card rounded-xl border border-border shadow-card p-4 flex items-center gap-4 cursor-pointer hover:bg-secondary/30 transition-colors"
                    onClick={() => setSelected(r)}
                  >
                    <div className={`w-10 h-10 rounded-lg ${ENTITY_COLORS[r.entityType]} flex items-center justify-center shrink-0`}>
                      {React.createElement(ENTITY_ICONS[r.entityType], { className: "w-5 h-5" })}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.ownerName} · {r.city || "—"} · {r.submittedDate}</p>
                    </div>
                    <StatusBadge variant={r.status === "approved" ? "success" : r.status === "rejected" ? "destructive" : "warning"}>
                      {r.status}
                    </StatusBadge>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">No registration requests found</div>
        )}
      </div>

      {/* Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="font-display">Registration Details</SheetTitle>
          </SheetHeader>
          {selected && (
            <div className="space-y-6 mt-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl ${ENTITY_COLORS[selected.entityType]} flex items-center justify-center`}>
                  {React.createElement(ENTITY_ICONS[selected.entityType], { className: "w-7 h-7" })}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selected.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{selected.entityType}</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  ["Email", selected.email],
                  ["Phone", selected.phone || "—"],
                  ["City", selected.city || "—"],
                  ["Website", selected.website || "—"],
                  ["Owner", selected.ownerName],
                  ["Owner Email", selected.ownerEmail],
                  ["Submitted", selected.submittedDate],
                  ["Status", selected.status],
                  ...(selected.industry ? [["Industry", selected.industry]] : []),
                  ...(selected.countries?.length ? [["Countries", selected.countries.join(", ")]] : []),
                  ...(selected.specializations?.length ? [["Specializations", selected.specializations.join(", ")]] : []),
                  ...(selected.teachingMode ? [["Teaching Mode", selected.teachingMode]] : []),
                  ...(selected.courses?.length ? [["Courses", selected.courses.join(", ")]] : []),
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm font-medium capitalize">{value}</span>
                  </div>
                ))}
              </div>
              {selected.description && (
                <div>
                  <span className="text-sm text-muted-foreground">Description</span>
                  <p className="text-sm mt-1">{selected.description}</p>
                </div>
              )}
              {selected.status === "pending" && (
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => updateMutation.mutate({ id: selected.id, status: "approved" })}
                    disabled={updateMutation.isPending}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" /> Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => updateMutation.mutate({ id: selected.id, status: "rejected" })}
                    disabled={updateMutation.isPending}
                  >
                    <XCircle className="w-4 h-4 mr-1" /> Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}


