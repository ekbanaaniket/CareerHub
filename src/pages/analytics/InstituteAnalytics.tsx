import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { motion } from "framer-motion";
import { Users, GraduationCap, Target, CalendarCheck, Award, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { useInstituteAnalytics } from "@/hooks/useAnalytics";
import { Skeleton } from "@/components/ui/skeleton";

const tooltipStyle = { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' };

export default function InstituteAnalytics() {
  const { data, isLoading } = useInstituteAnalytics();

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

  const { stats, enrollmentTrend, performanceDistribution, coursePopularity, radarData, attendanceByMonth, topPerformers } = data;

  return (
    <div className="space-y-6">
      <PageHeader title="Institute Analytics" description="Advanced insights across all institutes on the platform" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Enrollment" value={stats.totalEnrollment.toLocaleString()} change={stats.enrollmentChange} changeType="positive" icon={<Users className="w-5 h-5" />} />
        <StatCard title="Active Courses" value={String(stats.activeCourses)} change={stats.coursesChange} changeType="positive" icon={<GraduationCap className="w-5 h-5" />} />
        <StatCard title="Avg Completion Rate" value={`${stats.avgCompletionRate}%`} change={stats.completionChange} changeType="positive" icon={<Target className="w-5 h-5" />} />
        <StatCard title="Avg Attendance" value={`${stats.avgAttendance}%`} change={stats.attendanceChange} changeType="positive" icon={<CalendarCheck className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Enrollment Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={enrollmentTrend}>
              <defs>
                <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(152, 55%, 50%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(152, 55%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(220, 9%, 46%)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(220, 9%, 46%)' }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="new" stroke="hsl(152, 55%, 50%)" fill="url(#colorNew)" strokeWidth={2} name="New Enrollments" />
              <Area type="monotone" dataKey="dropped" stroke="hsl(0, 84%, 60%)" fill="hsl(0, 84%, 60%)" fillOpacity={0.1} strokeWidth={2} name="Dropouts" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Grade Distribution</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={performanceDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {performanceDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {performanceDistribution.map(e => (
              <div key={e.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: e.color }} />
                {e.name}: {e.value}%
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Course Popularity & Completion</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={coursePopularity} layout="vertical">
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(220, 9%, 46%)' }} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(220, 9%, 46%)' }} width={120} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="students" fill="hsl(224, 76%, 63%)" radius={[0, 6, 6, 0]} name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Performance Radar</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(220, 13%, 91%)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'hsl(220, 9%, 46%)' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar name="Score" dataKey="A" stroke="hsl(224, 76%, 63%)" fill="hsl(224, 76%, 63%)" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Attendance Rate Over Time</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={attendanceByMonth}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(220, 9%, 46%)' }} />
              <YAxis domain={[75, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(220, 9%, 46%)' }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="rate" stroke="hsl(224, 76%, 63%)" strokeWidth={2.5} dot={{ fill: 'hsl(224, 76%, 63%)', r: 4 }} name="Attendance %" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" /> Top Performers
          </h3>
          <div className="space-y-3">
            {topPerformers.map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                  {s.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{s.course}</p>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold">
                  {s.score}%
                  {s.trend === "up" && <ArrowUpRight className="w-3.5 h-3.5 text-accent" />}
                  {s.trend === "down" && <ArrowDownRight className="w-3.5 h-3.5 text-destructive" />}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
