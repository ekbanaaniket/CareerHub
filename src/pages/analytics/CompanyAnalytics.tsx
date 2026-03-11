import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { motion } from "framer-motion";
import { Briefcase, Building2, Target, Clock, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { useCompanyAnalytics } from "@/hooks/useAnalytics";
import { Skeleton } from "@/components/ui/skeleton";

const tooltipStyle = { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' };

export default function CompanyAnalytics() {
  const { data, isLoading } = useCompanyAnalytics();

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

  const { stats, placementTrend, industryDistribution, salaryRanges, topHiringCompanies, jobTypeBreakdown, hiringTimeline } = data;

  return (
    <div className="space-y-6">
      <PageHeader title="Company & Placement Analytics" description="Insights into hiring trends, placements, and job market across the platform" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Vacancies" value={String(stats.activeVacancies)} change={stats.vacancyChange} changeType="positive" icon={<Briefcase className="w-5 h-5" />} />
        <StatCard title="Total Placements" value={String(stats.totalPlacements)} change={stats.placementChange} changeType="positive" icon={<CheckCircle className="w-5 h-5" />} />
        <StatCard title="Avg Time to Hire" value={stats.avgTimeToHire} change={stats.hireTimeChange} changeType="positive" icon={<Clock className="w-5 h-5" />} />
        <StatCard title="Placement Rate" value={`${stats.placementRate}%`} change={stats.rateChange} changeType="positive" icon={<Target className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Placement Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={placementTrend}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(220, 9%, 46%)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(220, 9%, 46%)' }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="placed" stroke="hsl(152, 55%, 50%)" fill="hsl(152, 55%, 50%)" fillOpacity={0.15} strokeWidth={2} name="Placed" />
              <Area type="monotone" dataKey="pending" stroke="hsl(38, 92%, 50%)" fill="hsl(38, 92%, 50%)" fillOpacity={0.1} strokeWidth={2} name="Pending" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Industry Distribution</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={industryDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {industryDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {industryDistribution.map(e => (
              <div key={e.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: e.color }} />
                {e.name}: {e.value}%
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Salary Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={salaryRanges}>
              <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(220, 9%, 46%)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(220, 9%, 46%)' }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="hsl(224, 76%, 63%)" radius={[6, 6, 0, 0]} name="Positions" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Job Type Breakdown</h3>
          <div className="space-y-3">
            {jobTypeBreakdown.map((j, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{j.type}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${(j.count / 156) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium w-8 text-right">{j.count}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Avg Time to Hire</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={hiringTimeline}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(220, 9%, 46%)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(220, 9%, 46%)' }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v} days`, 'Avg Days']} />
              <Line type="monotone" dataKey="avgDays" stroke="hsl(38, 92%, 50%)" strokeWidth={2.5} dot={{ fill: 'hsl(38, 92%, 50%)', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-card rounded-xl border border-border shadow-card p-5">
        <h3 className="text-sm font-semibold font-display mb-4 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" /> Top Hiring Companies
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {topHiringCompanies.map((c, i) => (
            <div key={i} className="p-4 rounded-lg bg-secondary/50 border border-border text-center">
              <div className="w-10 h-10 mx-auto rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm mb-2">
                {c.name[0]}
              </div>
              <p className="text-sm font-medium">{c.name}</p>
              <p className="text-[10px] text-muted-foreground mb-2">{c.industry}</p>
              <div className="flex items-center justify-center gap-1">
                <span className="text-lg font-bold text-primary">{c.filled}</span>
                <span className="text-xs text-muted-foreground">/ {c.positions}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">positions filled</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
