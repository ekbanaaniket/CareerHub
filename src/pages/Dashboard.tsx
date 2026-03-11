// ============= Dashboard Router =============
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useApp } from "@/contexts/AppContext";
import { Users, FileText, TrendingUp, GraduationCap, Clock, Building2, Globe, Briefcase, AlertTriangle, DollarSign, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";
import StudentDashboard from "./StudentDashboard";
import CompanyDashboard from "./CompanyDashboard";
import { Link } from "react-router-dom";
import { usePlatformDashboard } from "@/hooks/usePlatformDashboard";
import { useDashboardStats, useRecentActivities, usePerformanceData, useAttendanceData } from "@/hooks/useDashboard";
import { getIcon } from "@/services/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const tooltipStyle = { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' };

function PlatformOwnerDashboard() {
  const { data, isLoading } = usePlatformDashboard();

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      </div>
    );
  }

  const { stats, entityDistribution, platformGrowth, revenueData, flaggedEntities, analyticsLinks } = data;

  return (
    <div className="space-y-6">
      <PageHeader title="Platform Overview 👋" description="Monitor all entities across the platform" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Institutes" value={String(stats.totalInstitutes)} change="+2 this month" changeType="positive" icon={<Building2 className="w-5 h-5" />} />
        <StatCard title="Total Consultancies" value={String(stats.totalConsultancies)} change="+1 this month" changeType="positive" icon={<Globe className="w-5 h-5" />} />
        <StatCard title="Total Companies" value={String(stats.totalCompanies)} change="+3 this month" changeType="positive" icon={<Briefcase className="w-5 h-5" />} />
        <StatCard title="Total Students" value={stats.totalStudents.toLocaleString()} change="Across all entities" changeType="neutral" icon={<Users className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Platform Growth</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={platformGrowth}>
              <defs>
                <linearGradient id="colorInst" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(224, 76%, 63%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(224, 76%, 63%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(220, 9%, 46%)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(220, 9%, 46%)' }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="institutes" stroke="hsl(224, 76%, 63%)" fill="url(#colorInst)" strokeWidth={2} />
              <Area type="monotone" dataKey="consultancies" stroke="hsl(152, 55%, 50%)" fill="hsl(152, 55%, 50%)" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="companies" stroke="hsl(38, 92%, 50%)" fill="hsl(38, 92%, 50%)" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Entity Distribution</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={entityDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                  {entityDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {entityDistribution.map(e => (
              <div key={e.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: e.color }} />
                {e.name} ({e.value})
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl border border-border shadow-card p-5">
        <h3 className="text-sm font-semibold font-display mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning" /> Flagged Entities
        </h3>
        <div className="space-y-3">
          {flaggedEntities.map((e, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{e.name}</p>
                  <StatusBadge variant="outline">{e.type}</StatusBadge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{e.issue}</p>
              </div>
              <StatusBadge variant={e.severity as any}>{e.severity === "destructive" ? "Critical" : "Warning"}</StatusBadge>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card rounded-xl border border-border shadow-card p-5">
        <h3 className="text-sm font-semibold font-display mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" /> Platform Revenue
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(152, 55%, 50%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(152, 55%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(220, 9%, 46%)' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(220, 9%, 46%)' }} tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']} />
            <Area type="monotone" dataKey="revenue" stroke="hsl(152, 55%, 50%)" fill="url(#colorRev)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Active Courses" value={String(stats.activeCourses)} change={`Across ${stats.totalInstitutes} institutes`} changeType="neutral" icon={<GraduationCap className="w-5 h-5" />} />
        <StatCard title="Visa Applications" value={String(stats.visaApplications)} change={`${stats.visaPending} pending`} changeType="neutral" icon={<FileText className="w-5 h-5" />} />
        <StatCard title="Total Placements" value={String(stats.totalPlacements)} change={`+${stats.placementsChangePercent}% this quarter`} changeType="positive" icon={<TrendingUp className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {analyticsLinks.map((link, i) => {
          const LinkIcon = getIcon(link.iconName);
          return (
            <motion.div key={link.path} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}>
              <Link to={link.path} className="block bg-card rounded-xl border border-border shadow-card p-5 hover:shadow-elevated transition-all group">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${link.color}15` }}>
                    <LinkIcon className="w-5 h-5" style={{ color: link.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold">{link.title}</h4>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{link.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function InstituteDashboard() {
  const { currentInstitute } = useApp();
  const instituteId = currentInstitute?.id;
  const { data: stats, isLoading: statsLoading } = useDashboardStats(instituteId);
  const { data: activities } = useRecentActivities(instituteId);
  const { data: perfData } = usePerformanceData(instituteId);
  const { data: attData } = useAttendanceData(instituteId);

  if (statsLoading || !stats) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Welcome back 👋" description={`Here's what's happening at ${currentInstitute.name} today`} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={stats.totalStudents.toLocaleString()} change="+12% from last month" changeType="positive" icon={<Users className="w-5 h-5" />} />
        <StatCard title="Active Courses" value={String(stats.activeCourses)} change="3 new this week" changeType="positive" icon={<GraduationCap className="w-5 h-5" />} />
        <StatCard title="Tests Conducted" value={String(stats.testsConducted)} change="8 pending review" changeType="neutral" icon={<FileText className="w-5 h-5" />} />
        <StatCard title="Avg Performance" value={`${stats.avgPerformance}%`} change="+5% improvement" changeType="positive" icon={<TrendingUp className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Average Performance</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={perfData ?? []}>
              <defs>
                <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(224, 76%, 63%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(224, 76%, 63%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(220, 9%, 46%)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(220, 9%, 46%)' }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="avg" stroke="hsl(224, 76%, 63%)" fill="url(#colorAvg)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Weekly Attendance</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={attData ?? []}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(220, 9%, 46%)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(220, 9%, 46%)' }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="present" fill="hsl(152, 55%, 50%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {activities && activities.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {activities.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                  {a.student.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{a.student}</p>
                  <p className="text-xs text-muted-foreground truncate">{a.action}</p>
                </div>
                <div className="text-right shrink-0">
                  <StatusBadge variant={a.status}>{a.status === "success" ? "Done" : a.status === "destructive" ? "Failed" : a.status === "info" ? "New" : "Pending"}</StatusBadge>
                  <p className="text-xs text-muted-foreground mt-1">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === "student") return <StudentDashboard />;
  if (user?.role === "company") return <CompanyDashboard />;
  if (user?.role === "platform_owner") return <PlatformOwnerDashboard />;

  return <InstituteDashboard />;
}
