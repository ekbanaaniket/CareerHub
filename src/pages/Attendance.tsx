// ============= Attendance Page =============
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatCard } from "@/components/common/StatCard";
import { ExportButton } from "@/components/common/ExportButton";
import { ActionMenu } from "@/components/common/ActionMenu";
import { EntityGroupFilter, MOCK_INSTITUTES } from "@/components/common/EntityGroupFilter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarCheck, Search, Users, Clock, AlertCircle, CheckCircle, Edit, Trash2, Building2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useCanManage } from "@/hooks/useCanManage";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { fetchAttendance, type AttendanceRecord } from "@/services/attendance";

export default function Attendance() {
  const { isViewOnly } = useCanManage();
  const { user } = useAuth();
  const { currentInstitute } = useApp();
  const isPlatformOwner = user?.role === "platform_owner";

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("2026-03-03");
  const [entityFilter, setEntityFilter] = useState("all");
  const [editOpen, setEditOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<AttendanceRecord | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const instituteIdParam = isPlatformOwner
    ? (entityFilter !== "all" ? entityFilter : undefined)
    : currentInstitute.id;

  useEffect(() => {
    setLoading(true);
    fetchAttendance({ search, status: statusFilter, date: dateFilter, instituteId: instituteIdParam }).then((res) => {
      setRecords(res.data);
      setLoading(false);
    });
  }, [search, statusFilter, dateFilter, instituteIdParam]);

  // Group by institute for platform owner
  const groupedRecords = useMemo(() => {
    if (!isPlatformOwner || entityFilter !== "all") return null;
    const groups: Record<string, { instituteName: string; records: AttendanceRecord[] }> = {};
    for (const r of records) {
      const instId = r.instituteId ?? "unknown";
      const instName = MOCK_INSTITUTES.find((i) => i.id === instId)?.name ?? `Institute ${instId}`;
      if (!groups[instId]) groups[instId] = { instituteName: instName, records: [] };
      groups[instId].records.push(r);
    }
    return groups;
  }, [isPlatformOwner, records, entityFilter]);

  const presentCount = records.filter((r) => r.status === "present").length;
  const absentCount = records.filter((r) => r.status === "absent").length;
  const lateCount = records.filter((r) => r.status === "late").length;
  const percentage = records.length > 0 ? Math.round(((presentCount + lateCount) / records.length) * 100) : 0;

  const handleEdit = (record: AttendanceRecord) => { setEditRecord({ ...record }); setEditOpen(true); };
  const handleSaveEdit = () => {
    if (!editRecord) return;
    setRecords((prev) => prev.map((r) => (r.id === editRecord.id ? editRecord : r)));
    setEditOpen(false);
    toast({ title: "Attendance updated", description: `${editRecord.studentName}'s record updated.` });
  };
  const handleDelete = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    setDeleteConfirm(null);
    toast({ title: "Record deleted" });
  };

  const statusVariant = (s: string) => {
    switch (s) { case "present": return "success"; case "absent": return "destructive"; case "late": return "warning"; case "excused": return "info"; default: return "default" as const; }
  };

  const renderRows = (data: AttendanceRecord[]) => data.map((r) => (
    <tr key={r.id} className="hover:bg-secondary/30 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
            {r.studentName.split(" ").map((n) => n[0]).join("")}
          </div>
          <div><p className="text-sm font-medium">{r.studentName}</p><p className="text-xs text-muted-foreground">{r.studentId}</p></div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm">{r.courseName}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{r.date}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{r.checkInTime ?? "—"}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{r.checkOutTime ?? "—"}</td>
      <td className="px-4 py-3"><StatusBadge variant={statusVariant(r.status) as any}>{r.status}</StatusBadge></td>
      <td className="px-4 py-3">
        {!isViewOnly && (
          <ActionMenu actions={[
            { label: "Edit", icon: Edit, onClick: () => handleEdit(r) },
            { label: "Delete", icon: Trash2, onClick: () => setDeleteConfirm(r.id), variant: "destructive", separator: true },
          ]} />
        )}
      </td>
    </tr>
  ));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Tracking"
        description={isPlatformOwner ? "View attendance across all institutes" : "Monitor and manage student attendance"}
        actions={<ExportButton data={records as any} filename="attendance" />}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard title="Present" value={String(presentCount)} icon={<CheckCircle className="w-5 h-5" />} change={`${percentage}% rate`} changeType="positive" />
        <StatCard title="Absent" value={String(absentCount)} icon={<AlertCircle className="w-5 h-5" />} change="Need follow-up" changeType="negative" />
        <StatCard title="Late" value={String(lateCount)} icon={<Clock className="w-5 h-5" />} change="Track pattern" changeType="neutral" />
        <StatCard title="Total" value={String(records.length)} icon={<Users className="w-5 h-5" />} change={dateFilter} changeType="neutral" />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col sm:flex-row gap-3">
        {isPlatformOwner && (
          <EntityGroupFilter label="Institutes" entities={MOCK_INSTITUTES} selected={entityFilter} onSelect={setEntityFilter} />
        )}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search students..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-44" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="present">Present</SelectItem>
            <SelectItem value="absent">Absent</SelectItem>
            <SelectItem value="late">Late</SelectItem>
            <SelectItem value="excused">Excused</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Loading...</div>
      ) : isPlatformOwner && groupedRecords ? (
        <div className="space-y-6">
          {Object.entries(groupedRecords).map(([instId, group]) => (
            <div key={instId} className="space-y-2">
              <h3 className="text-sm font-semibold font-display flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-primary" />
                {group.instituteName}
                <span className="text-xs font-normal">({group.records.length} records)</span>
              </h3>
              <DataTable headers={["Student", "Course", "Date", "Check In", "Check Out", "Status", ""]}>
                {renderRows(group.records)}
              </DataTable>
            </div>
          ))}
          {Object.keys(groupedRecords).length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">No records found</div>
          )}
        </div>
      ) : (
        <DataTable headers={["Student", "Course", "Date", "Check In", "Check Out", "Status", ""]}>
          {renderRows(records)}
          {records.length === 0 && (<tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground text-sm">No records found</td></tr>)}
        </DataTable>
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Edit Attendance</DialogTitle></DialogHeader>
          {editRecord && (
            <div className="space-y-4 mt-2">
              <div><Label>Student</Label><Input value={editRecord.studentName} disabled className="mt-1" /></div>
              <div><Label>Status</Label>
                <Select value={editRecord.status} onValueChange={(v) => setEditRecord({ ...editRecord, status: v as any })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="excused">Excused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Check In</Label><Input type="time" value={editRecord.checkInTime ?? ""} onChange={(e) => setEditRecord({ ...editRecord, checkInTime: e.target.value })} className="mt-1" /></div>
                <div><Label>Check Out</Label><Input type="time" value={editRecord.checkOutTime ?? ""} onChange={(e) => setEditRecord({ ...editRecord, checkOutTime: e.target.value })} className="mt-1" /></div>
              </div>
              <Button className="w-full" onClick={handleSaveEdit}>Save Changes</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)} title="Delete Record" description="Are you sure you want to delete this attendance record?" confirmLabel="Delete" variant="destructive" onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)} />
    </div>
  );
}
