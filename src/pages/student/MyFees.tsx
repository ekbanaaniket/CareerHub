// ============= Student: My Fees (Read-Only) =============
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatCard } from "@/components/common/StatCard";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const feeData = [
  {
    institute: "TechVerse Academy", id: "1",
    fees: [
      { id: "F1", type: "Tuition", amount: 5000, paid: 5000, status: "paid", dueDate: "Mar 15, 2026", paidDate: "Mar 1, 2026" },
      { id: "F2", type: "Exam Fee", amount: 200, paid: 200, status: "paid", dueDate: "Mar 10, 2026", paidDate: "Mar 2, 2026" },
      { id: "F3", type: "Lab Fee", amount: 300, paid: 0, status: "pending", dueDate: "Apr 1, 2026" },
    ],
  },
  {
    institute: "CodeCraft Institute", id: "2",
    fees: [
      { id: "F4", type: "Tuition", amount: 3000, paid: 1500, status: "partial", dueDate: "Mar 20, 2026" },
    ],
  },
];

export default function MyFees() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? feeData : feeData.filter(f => f.institute === filter);

  const totalAmount = filtered.reduce((s, f) => s + f.fees.reduce((fs, fee) => fs + fee.amount, 0), 0);
  const totalPaid = filtered.reduce((s, f) => s + f.fees.reduce((fs, fee) => fs + fee.paid, 0), 0);
  const totalPending = totalAmount - totalPaid;

  return (
    <div className="space-y-6">
      <PageHeader title="My Fees" description="Fee status across enrolled institutes" />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard title="Total Fees" value={`$${totalAmount.toLocaleString()}`} change="All institutes" changeType="neutral" icon={<CreditCard className="w-5 h-5" />} />
        <StatCard title="Paid" value={`$${totalPaid.toLocaleString()}`} change={`${Math.round(totalPaid / totalAmount * 100)}% paid`} changeType="positive" icon={<CheckCircle className="w-5 h-5" />} />
        <StatCard title="Pending" value={`$${totalPending.toLocaleString()}`} change="Due soon" changeType="negative" icon={<AlertCircle className="w-5 h-5" />} />
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All Institutes</TabsTrigger>
          {feeData.map(f => <TabsTrigger key={f.id} value={f.institute}>{f.institute}</TabsTrigger>)}
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {filtered.map(group => (
          <motion.div key={group.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5">
            <h3 className="text-sm font-semibold font-display mb-4">{group.institute}</h3>
            <div className="space-y-3">
              {group.fees.map(fee => (
                <div key={fee.id} className="p-3 rounded-lg bg-secondary/30 border border-border flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{fee.type}</p>
                    <p className="text-xs text-muted-foreground">Due: {fee.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">${fee.amount.toLocaleString()}</p>
                    <StatusBadge variant={fee.status === "paid" ? "success" : fee.status === "partial" ? "warning" : "destructive"}>{fee.status}</StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
