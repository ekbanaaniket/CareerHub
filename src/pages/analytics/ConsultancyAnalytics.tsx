import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { motion } from "framer-motion";
import { Plane, University, Languages, UserCheck } from "lucide-react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useConsultancyAnalytics } from "@/hooks/useAnalytics";
import { Skeleton } from "@/components/ui/skeleton";

const tooltipStyle = { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' };

export default function ConsultancyAnalytics() {
  const { data, isLoading } = useConsultancyAnalytics();

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      </div>
    );
  }

  const { stats, visaStatus, universityAppsTrend, topDestinations, languageEnrollment, counselorPerformance, monthlyRevenue } = data;

  return (
    <div className="space-y-6">
      <PageHeader title="Consultancy Analytics" description="Deep insights into visa, university applications, and counselor performance" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Visa Apps" value={String(stats.totalVisaApps)} change={stats.visaChange} changeType="positive" icon={<Plane className="w-5 h-5" />} />
        <StatCard title="University Apps" value={String(stats.universityApps)} change={stats.uniChange} changeType="positive" icon={<University className="w-5 h-5" />} />
        <StatCard title="Language Students" value={String(stats.languageStudents)} change={stats.langChange} changeType="positive" icon={<Languages className="w-5 h-5" />} />
        <StatCard title="Active Counselors" value={String(stats.activeCounselors)} change={stats.counselorRate} changeType="positive" icon={<UserCheck className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Visa Application Status</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={visaStatus} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {visaStatus.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {visaStatus.map(e => (
              <div key={e.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: e.color }} />
                {e.name}: {e.value}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">University Applications Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={universityAppsTrend}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(220, 9%, 46%)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(220, 9%, 46%)' }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="submitted" stroke="hsl(224, 76%, 63%)" fill="hsl(224, 76%, 63%)" fillOpacity={0.1} strokeWidth={2} name="Submitted" />
              <Area type="monotone" dataKey="accepted" stroke="hsl(152, 55%, 50%)" fill="hsl(152, 55%, 50%)" fillOpacity={0.1} strokeWidth={2} name="Accepted" />
              <Area type="monotone" dataKey="rejected" stroke="hsl(0, 84%, 60%)" fill="hsl(0, 84%, 60%)" fillOpacity={0.1} strokeWidth={2} name="Rejected" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Top Destinations</h3>
          <div className="space-y-3">
            {topDestinations.map((d, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/50">
                <div>
                  <p className="text-sm font-medium">{d.country}</p>
                  <p className="text-xs text-muted-foreground">{d.apps} applications</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary">{d.acceptance}%</p>
                  <p className="text-[10px] text-muted-foreground">acceptance</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Language Enrollment</h3>
          <div className="space-y-3">
            {languageEnrollment.map((l, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/50">
                <div>
                  <p className="text-sm font-medium">{l.language}</p>
                  <p className="text-xs text-muted-foreground">{l.students} students</p>
                </div>
                <StatusBadge variant="default">Avg: {l.avgScore}</StatusBadge>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Counselor Performance</h3>
          <div className="space-y-3">
            {counselorPerformance.map((c, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                  {c.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.clients} clients · {c.pending} pending</p>
                </div>
                <span className="text-sm font-semibold text-primary">{c.successRate}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-card rounded-xl border border-border shadow-card p-5">
        <h3 className="text-sm font-semibold font-display mb-4">Monthly Revenue</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={monthlyRevenue}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(220, 9%, 46%)' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(220, 9%, 46%)' }} tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']} />
            <Line type="monotone" dataKey="revenue" stroke="hsl(152, 55%, 50%)" strokeWidth={2.5} dot={{ fill: 'hsl(152, 55%, 50%)', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
