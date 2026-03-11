// ============= Student: My Attendance (Read-Only) =============
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { CalendarCheck, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

const attendanceData = [
  {
    institute: "TechVerse Academy", id: "1",
    courses: [
      { name: "Full-Stack 2026", total: 45, present: 40, absent: 3, late: 2, percentage: 89 },
      { name: "Frontend Bootcamp", total: 20, present: 18, absent: 1, late: 1, percentage: 90 },
    ],
    lastWeek: [true, true, false, true, true, true, false],
  },
  {
    institute: "CodeCraft Institute", id: "2",
    courses: [
      { name: "React Advanced", total: 12, present: 10, absent: 1, late: 1, percentage: 83 },
    ],
    lastWeek: [true, false, true, true, true, false, false],
  },
];

export default function MyAttendance() {
  const [filter, setFilter] = useState("all");
  const institutes = attendanceData.map(a => a.institute);

  const filtered = filter === "all" ? attendanceData : attendanceData.filter(a => a.institute === filter);
  const totalPresent = filtered.reduce((s, a) => s + a.courses.reduce((cs, c) => cs + c.present, 0), 0);
  const totalClasses = filtered.reduce((s, a) => s + a.courses.reduce((cs, c) => cs + c.total, 0), 0);
  const overallPct = totalClasses > 0 ? Math.round(totalPresent / totalClasses * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader title="My Attendance" description="Attendance records across all enrolled institutes" />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard title="Overall Attendance" value={`${overallPct}%`} change={`${totalPresent}/${totalClasses} classes`} changeType={overallPct >= 85 ? "positive" : "negative"} icon={<CalendarCheck className="w-5 h-5" />} />
        <StatCard title="Present" value={String(totalPresent)} change="Classes attended" changeType="positive" icon={<CheckCircle className="w-5 h-5" />} />
        <StatCard title="Absent/Late" value={String(totalClasses - totalPresent)} change="Missed classes" changeType="negative" icon={<AlertCircle className="w-5 h-5" />} />
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All Institutes</TabsTrigger>
          {institutes.map(i => <TabsTrigger key={i} value={i}>{i}</TabsTrigger>)}
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {filtered.map(att => (
          <motion.div key={att.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5">
            <h3 className="text-sm font-semibold font-display mb-4">{att.institute}</h3>

            <div className="flex items-center gap-1.5 mb-4">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                <div key={day} className="flex-1 text-center">
                  <div className={`w-full aspect-square rounded-md flex items-center justify-center ${att.lastWeek[i] ? "bg-success/20" : "bg-destructive/20"}`}>
                    {att.lastWeek[i] ? <CheckCircle className="w-3 h-3 text-success" /> : <AlertCircle className="w-3 h-3 text-destructive" />}
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{day}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {att.courses.map(c => (
                <div key={c.name} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30 border border-border">
                  <span className="text-sm font-medium">{c.name}</span>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="text-success">{c.present} present</span>
                    <span className="text-destructive">{c.absent} absent</span>
                    <span className="text-warning">{c.late} late</span>
                    <span className="font-bold text-foreground">{c.percentage}%</span>
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
