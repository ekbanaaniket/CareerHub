// ============= Fees & Billing Page =============
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatCard } from "@/components/common/StatCard";
import { ExportButton } from "@/components/common/ExportButton";
import { ActionMenu } from "@/components/common/ActionMenu";
import { EntityGroupFilter, MOCK_INSTITUTES } from "@/components/common/EntityGroupFilter";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CreditCard, Search, DollarSign, AlertCircle, CheckCircle, TrendingUp, Plus, Trash2, Receipt, Building2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { useCanManage } from "@/hooks/useCanManage";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { fetchFees, type FeeRecord } from "@/services/fees";

export default function Fees() {
  const { isViewOnly } = useCanManage();
  const { user } = useAuth();
  const { currentInstitute } = useApp();
  const isPlatformOwner = user?.role === "platform_owner";

  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [entityFilter, setEntityFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<FeeRecord | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [newFee, setNewFee] = useState({ studentName: "", type: "tuition", amount: "", dueDate: "", courseName: "" });

  const instituteIdParam = isPlatformOwner
    ? (entityFilter !== "all" ? entityFilter : undefined)
    : currentInstitute.id;

  useEffect(() => {
    setLoading(true);
    fetchFees({ search, status: statusFilter, type: typeFilter, instituteId: instituteIdParam }).then((res) => {
      setFees(res.data);
      setLoading(false);
    });
  }, [search, statusFilter, typeFilter, instituteIdParam]);

  // Group by institute for platform owner
  const groupedFees = useMemo(() => {
    if (!isPlatformOwner || entityFilter !== "all") return null;
    const groups: Record<string, { instituteName: string; fees: FeeRecord[] }> = {};
    for (const f of fees) {
      const instId = f.instituteId ?? "unknown";
      const instName = MOCK_INSTITUTES.find((i) => i.id === instId)?.name ?? `Institute ${instId}`;
      if (!groups[instId]) groups[instId] = { instituteName: instName, fees: [] };
      groups[instId].fees.push(f);
    }
    return groups;
  }, [isPlatformOwner, fees, entityFilter]);

  const totalRevenue = fees.filter((f) => f.status === "paid").reduce((s, f) => s + f.paidAmount, 0);
  const totalPending = fees.filter((f) => f.status === "pending" || f.status === "partial").reduce((s, f) => s + (f.amount - f.paidAmount), 0);
  const totalOverdue = fees.filter((f) => f.status === "overdue").reduce((s, f) => s + f.amount, 0);
  const collectionRate = fees.length > 0 ? Math.round((fees.filter((f) => f.status === "paid").length / fees.length) * 100) : 0;

  const handleRecordPayment = () => {
    if (!selectedFee || !paymentAmount) return;
    const amount = parseFloat(paymentAmount);
    const newPaid = selectedFee.paidAmount + amount;
    const newStatus = newPaid >= selectedFee.amount ? "paid" : "partial";
    setFees((prev) => prev.map((f) => f.id === selectedFee.id ? { ...f, paidAmount: newPaid, status: newStatus as any, paidDate: "2026-03-03", paymentMethod, transactionId: `TXN${Date.now()}` } : f));
    setPaymentOpen(false);
    setPaymentAmount("");
    toast({ title: "Payment recorded", description: `$${amount} received from ${selectedFee.studentName}` });
  };

  const handleAddFee = () => {
    const fee: FeeRecord = {
      id: `F${String(fees.length + 1).padStart(3, "0")}`, studentId: `S${String(Math.floor(Math.random() * 8) + 1).padStart(3, "0")}`,
      studentName: newFee.studentName, type: newFee.type as any, amount: parseFloat(newFee.amount),
      dueDate: newFee.dueDate, status: "pending", paidAmount: 0, courseId: "C001",
      courseName: newFee.courseName || "Full-Stack 2026", instituteId: currentInstitute.id,
    };
    setFees((prev) => [...prev, fee]);
    setAddOpen(false);
    setNewFee({ studentName: "", type: "tuition", amount: "", dueDate: "", courseName: "" });
    toast({ title: "Fee created", description: `New ${fee.type} fee for ${fee.studentName}` });
  };

  const handleDelete = (id: string) => {
    setFees((prev) => prev.filter((f) => f.id !== id));
    setDeleteConfirm(null);
    toast({ title: "Fee deleted" });
  };

  const statusVariant = (s: string) => {
    switch (s) { case "paid": return "success"; case "pending": return "warning"; case "overdue": return "destructive"; case "partial": return "info"; default: return "default" as const; }
  };

  const renderRows = (data: FeeRecord[]) => data.map((f) => (
    <tr key={f.id} className="hover:bg-secondary/30 transition-colors">
      <td className="px-4 py-3"><div><p className="text-sm font-medium">{f.studentName}</p><p className="text-xs text-muted-foreground">{f.courseName}</p></div></td>
      <td className="px-4 py-3"><StatusBadge variant="outline">{f.type}</StatusBadge></td>
      <td className="px-4 py-3 text-sm font-medium">${f.amount.toLocaleString()}</td>
      <td className="px-4 py-3 text-sm">${f.paidAmount.toLocaleString()}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{f.dueDate}</td>
      <td className="px-4 py-3"><StatusBadge variant={statusVariant(f.status) as any}>{f.status}</StatusBadge></td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{f.paymentMethod ?? "—"}</td>
      <td className="px-4 py-3">
        {!isViewOnly && (
          <ActionMenu actions={[
            { label: "Record Payment", icon: Receipt, onClick: () => { setSelectedFee(f); setPaymentOpen(true); } },
            { label: "Delete", icon: Trash2, onClick: () => setDeleteConfirm(f.id), variant: "destructive", separator: true },
          ]} />
        )}
      </td>
    </tr>
  ));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fees & Billing"
        description={isPlatformOwner ? "View fees across all institutes" : "Manage student fees, payments, and billing"}
        actions={
          <div className="flex gap-2">
            <ExportButton data={fees as any} filename="fees" />
            {!isViewOnly && (
              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-1" /> Create Fee</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle className="font-display">Create Fee Record</DialogTitle></DialogHeader>
                  <div className="space-y-4 mt-2">
                    <div><Label>Student Name</Label><Input placeholder="John Doe" className="mt-1" value={newFee.studentName} onChange={(e) => setNewFee({ ...newFee, studentName: e.target.value })} /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label>Type</Label>
                        <Select value={newFee.type} onValueChange={(v) => setNewFee({ ...newFee, type: v })}>
                          <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tuition">Tuition</SelectItem><SelectItem value="registration">Registration</SelectItem>
                            <SelectItem value="exam">Exam</SelectItem><SelectItem value="library">Library</SelectItem>
                            <SelectItem value="lab">Lab</SelectItem><SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div><Label>Amount ($)</Label><Input type="number" placeholder="5000" className="mt-1" value={newFee.amount} onChange={(e) => setNewFee({ ...newFee, amount: e.target.value })} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label>Due Date</Label><Input type="date" className="mt-1" value={newFee.dueDate} onChange={(e) => setNewFee({ ...newFee, dueDate: e.target.value })} /></div>
                      <div><Label>Course</Label><Input placeholder="Full-Stack 2026" className="mt-1" value={newFee.courseName} onChange={(e) => setNewFee({ ...newFee, courseName: e.target.value })} /></div>
                    </div>
                    <Button className="w-full" onClick={handleAddFee} disabled={!newFee.studentName || !newFee.amount}>Create Fee</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard title="Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={<DollarSign className="w-5 h-5" />} change={`${collectionRate}% rate`} changeType="positive" />
        <StatCard title="Pending" value={`$${totalPending.toLocaleString()}`} icon={<CreditCard className="w-5 h-5" />} change="Awaiting payment" changeType="neutral" />
        <StatCard title="Overdue" value={`$${totalOverdue.toLocaleString()}`} icon={<AlertCircle className="w-5 h-5" />} change="Need follow-up" changeType="negative" />
        <StatCard title="Collection" value={`${collectionRate}%`} icon={<TrendingUp className="w-5 h-5" />} change="Overall rate" changeType="positive" />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col sm:flex-row gap-3">
        {isPlatformOwner && (
          <EntityGroupFilter label="Institutes" entities={MOCK_INSTITUTES} selected={entityFilter} onSelect={setEntityFilter} />
        )}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name or ID..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem><SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem><SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem><SelectItem value="tuition">Tuition</SelectItem>
            <SelectItem value="registration">Registration</SelectItem><SelectItem value="exam">Exam</SelectItem>
            <SelectItem value="library">Library</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Loading...</div>
      ) : isPlatformOwner && groupedFees ? (
        <div className="space-y-6">
          {Object.entries(groupedFees).map(([instId, group]) => (
            <div key={instId} className="space-y-2">
              <h3 className="text-sm font-semibold font-display flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-primary" />
                {group.instituteName}
                <span className="text-xs font-normal">({group.fees.length} records)</span>
              </h3>
              <DataTable headers={["Student", "Type", "Amount", "Paid", "Due Date", "Status", "Method", ""]}>
                {renderRows(group.fees)}
              </DataTable>
            </div>
          ))}
          {Object.keys(groupedFees).length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">No fee records found</div>
          )}
        </div>
      ) : (
        <DataTable headers={["Student", "Type", "Amount", "Paid", "Due Date", "Status", "Method", ""]}>
          {renderRows(fees)}
          {fees.length === 0 && (<tr><td colSpan={8} className="px-4 py-12 text-center text-muted-foreground text-sm">No fee records found</td></tr>)}
        </DataTable>
      )}

      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Record Payment</DialogTitle></DialogHeader>
          {selectedFee && (
            <div className="space-y-4 mt-2">
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-sm font-medium">{selectedFee.studentName}</p>
                <p className="text-xs text-muted-foreground">Outstanding: ${(selectedFee.amount - selectedFee.paidAmount).toLocaleString()}</p>
              </div>
              <div><Label>Amount ($)</Label><Input type="number" placeholder={String(selectedFee.amount - selectedFee.paidAmount)} className="mt-1" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} /></div>
              <div><Label>Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Credit/Debit Card</SelectItem><SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem><SelectItem value="cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleRecordPayment} disabled={!paymentAmount}>Record Payment</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)} title="Delete Fee" description="Are you sure? This action cannot be undone." confirmLabel="Delete" variant="destructive" onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)} />
    </div>
  );
}
