import { PageHeader } from "@/components/common/PageHeader";
import StudentDashboard from "@/pages/StudentDashboard";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { Users, FileText, TrendingUp, GraduationCap, Clock, Briefcase, Plane, University, Languages, UserCheck, Building2, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";
import { useDashboardStats, useRecentActivities, usePerformanceData, useAttendanceData } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";

// ============= Institute Dashboard =============
function InstituteDashboard() {
  const { currentInstitute } = useApp();
  const { data: stats, isLoading: statsLoading } = useDashboardStats(currentInstitute.id);
  const { data: activities, isLoading: activitiesLoading } = useRecentActivities(currentInstitute.id);
  const { data: performanceData, isLoading: perfLoading } = usePerformanceData(currentInstitute.id);
  const { data: attendanceData, isLoading: attLoading } = useAttendanceData(currentInstitute.id);

  const upcomingTests = [
    { name: "JavaScript Fundamentals", date: "Mar 5, 2026", students: 45, type: "Quiz" },
    { name: "React & TypeScript", date: "Mar 8, 2026", students: 38, type: "Exam" },
    { name: "Node.js Backend", date: "Mar 12, 2026", students: 42, type: "Exam" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Welcome back 👋" description={`Here's what's happening at ${currentInstitute.name} today`} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statsLoading ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />) : (
          <>
            <StatCard title="Total Students" value={stats?.totalStudents?.toLocaleString() ?? "0"} change="+12% from last month" changeType="positive" icon={<Users className="w-5 h-5" />} />
            <StatCard title="Active Courses" value={String(stats?.activeCourses ?? 0)} change="3 new this week" changeType="positive" icon={<GraduationCap className="w-5 h-5" />} />
            <StatCard title="Tests Conducted" value={String(stats?.testsConducted ?? 0)} change="8 pending review" changeType="neutral" icon={<FileText className="w-5 h-5" />} />
            <StatCard title="Avg Performance" value={`${stats?.avgPerformance ?? 0}%`} change="+5% improvement" changeType="positive" icon={<TrendingUp className="w-5 h-5" />} />
            <StatCard title="Placements" value={String(stats?.totalPlacements ?? 0)} change="12 this month" changeType="positive" icon={<Briefcase className="w-5 h-5" />} />
          </>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Average Performance</h3>
          {perfLoading ? <Skeleton className="h-[220px]" /> : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={performanceData}>
                <defs><linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(224, 76%, 63%)" stopOpacity={0.2} /><stop offset="95%" stopColor="hsl(224, 76%, 63%)" stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(220, 9%, 46%)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(220, 9%, 46%)' }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="avg" stroke="hsl(224, 76%, 63%)" fill="url(#colorAvg)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Weekly Attendance</h3>
          {attLoading ? <Skeleton className="h-[220px]" /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={attendanceData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(220, 9%, 46%)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(220, 9%, 46%)' }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="present" fill="hsl(152, 55%, 50%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Recent Activity</h3>
          {activitiesLoading ? <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div> : (
            <div className="space-y-3">
              {activities?.map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                    {a.student.split(" ").map((n) => n[0]).join("")}
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
          )}
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Upcoming Tests</h3>
          <div className="space-y-3">
            {upcomingTests.map((t, i) => (
              <div key={i} className="p-3 rounded-lg bg-secondary/50 border border-border">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">{t.name}</p>
                  <StatusBadge variant={t.type === "Exam" ? "destructive" : "default"}>{t.type}</StatusBadge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {t.date}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {t.students}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ============= Platform Owner Dashboard =============
function PlatformDashboard() {
  const platformStats = [
    { title: "Total Institutes", value: "52", change: "+3 this month", changeType: "positive" as const, icon: <Building2 className="w-5 h-5" /> },
    { title: "Total Students", value: "12,480", change: "+8% growth", changeType: "positive" as const, icon: <Users className="w-5 h-5" /> },
    { title: "Active Courses", value: "340", change: "+15 new", changeType: "positive" as const, icon: <GraduationCap className="w-5 h-5" /> },
    { title: "Companies", value: "28", change: "5 new partners", changeType: "positive" as const, icon: <Briefcase className="w-5 h-5" /> },
    { title: "Consultancies", value: "12", change: "+2 this quarter", changeType: "positive" as const, icon: <Globe className="w-5 h-5" /> },
  ];

  const instituteGrowth = [
    { month: "Oct", institutes: 42, students: 9200 },
    { month: "Nov", institutes: 45, students: 10100 },
    { month: "Dec", institutes: 47, students: 10800 },
    { month: "Jan", institutes: 49, students: 11400 },
    { month: "Feb", institutes: 51, students: 12000 },
    { month: "Mar", institutes: 52, students: 12480 },
  ];

  const revenueByType = [
    { name: "Institutes", value: 65 },
    { name: "Consultancies", value: 20 },
    { name: "Companies", value: 15 },
  ];
  const COLORS = ["hsl(224, 76%, 63%)", "hsl(152, 55%, 50%)", "hsl(38, 92%, 50%)"];

  const recentOrgs = [
    { name: "ByteForge Labs", type: "Institute", city: "Seattle", status: "active" },
    { name: "GlobalConsult", type: "Consultancy", city: "London", status: "active" },
    { name: "InnoTech Corp", type: "Company", city: "Berlin", status: "pending" },
    { name: "EduBridge Academy", type: "Institute", city: "Toronto", status: "active" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Platform Overview 🌐" description="Monitor all institutes, consultancies, and companies across the platform" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {platformStats.map((s) => <StatCard key={s.title} {...s} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Platform Growth</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={instituteGrowth}>
              <defs><linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(224, 76%, 63%)" stopOpacity={0.2} /><stop offset="95%" stopColor="hsl(224, 76%, 63%)" stopOpacity={0} /></linearGradient></defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(220, 9%, 46%)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(220, 9%, 46%)' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="students" stroke="hsl(224, 76%, 63%)" fill="url(#colorStudents)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Revenue by Type</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={revenueByType} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                {revenueByType.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {revenueByType.map((r, i) => (
              <div key={r.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-muted-foreground">{r.name} ({r.value}%)</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-xl border border-border shadow-card p-5">
        <h3 className="text-sm font-semibold font-display mb-4">Recent Organizations</h3>
        <div className="space-y-3">
          {recentOrgs.map((org) => (
            <div key={org.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">{org.name[0]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{org.name}</p>
                <p className="text-xs text-muted-foreground">{org.city}</p>
              </div>
              <StatusBadge variant={org.type === "Institute" ? "info" : org.type === "Consultancy" ? "success" : "warning"}>{org.type}</StatusBadge>
              <StatusBadge variant={org.status === "active" ? "success" : "warning"}>{org.status}</StatusBadge>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ============= Consultancy Owner Dashboard =============
function ConsultancyDashboard() {
  const consultancyStats = [
    { title: "Active Students", value: "284", change: "+18 this month", changeType: "positive" as const, icon: <Users className="w-5 h-5" /> },
    { title: "Visa Applications", value: "67", change: "12 pending", changeType: "neutral" as const, icon: <Plane className="w-5 h-5" /> },
    { title: "University Apps", value: "142", change: "23 offers received", changeType: "positive" as const, icon: <University className="w-5 h-5" /> },
    { title: "Language Courses", value: "8", change: "3 starting soon", changeType: "positive" as const, icon: <Languages className="w-5 h-5" /> },
    { title: "Counselors", value: "15", change: "All active", changeType: "positive" as const, icon: <UserCheck className="w-5 h-5" /> },
  ];

  const visaStatus = [
    { status: "Approved", count: 32 },
    { status: "Processing", count: 18 },
    { status: "Pending", count: 12 },
    { status: "Rejected", count: 5 },
  ];
  const COLORS = ["hsl(152, 55%, 50%)", "hsl(224, 76%, 63%)", "hsl(38, 92%, 50%)", "hsl(0, 72%, 51%)"];

  const recentActivities = [
    { name: "Priya Patel", action: "Visa approved — USA", time: "30 min ago", status: "success" as const },
    { name: "Rahul Singh", action: "University offer — University of Toronto", time: "2 hrs ago", status: "info" as const },
    { name: "Aisha Khan", action: "IELTS result: 7.5 band", time: "4 hrs ago", status: "success" as const },
    { name: "Vikram Sharma", action: "Visa interview scheduled — UK", time: "6 hrs ago", status: "warning" as const },
    { name: "Neha Gupta", action: "Application rejected — ANU", time: "1 day ago", status: "destructive" as const },
  ];

  const countryData = [
    { country: "USA", apps: 42 }, { country: "UK", apps: 35 }, { country: "Canada", apps: 28 },
    { country: "Australia", apps: 22 }, { country: "Germany", apps: 15 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Consultancy Dashboard 🌍" description="Track visa applications, university admissions, and counselor performance" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {consultancyStats.map((s) => <StatCard key={s.title} {...s} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Visa Status Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={visaStatus} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="count">
                {visaStatus.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {visaStatus.map((v, i) => (
              <div key={v.status} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-muted-foreground">{v.status}: {v.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Applications by Country</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={countryData}>
              <XAxis dataKey="country" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(220, 9%, 46%)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(220, 9%, 46%)' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="apps" fill="hsl(224, 76%, 63%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-xl border border-border shadow-card p-5">
        <h3 className="text-sm font-semibold font-display mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivities.map((a, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">{a.name.split(" ").map(n => n[0]).join("")}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{a.name}</p>
                <p className="text-xs text-muted-foreground">{a.action}</p>
              </div>
              <StatusBadge variant={a.status}>{a.status === "success" ? "Done" : a.status === "destructive" ? "Failed" : a.status === "info" ? "New" : "Pending"}</StatusBadge>
              <span className="text-xs text-muted-foreground">{a.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ============= Company Dashboard =============
function CompanyDashboard() {
  const companyStats = [
    { title: "Active Vacancies", value: "12", change: "3 new this week", changeType: "positive" as const, icon: <Briefcase className="w-5 h-5" /> },
    { title: "Total Applications", value: "347", change: "+42 today", changeType: "positive" as const, icon: <FileText className="w-5 h-5" /> },
    { title: "Shortlisted", value: "86", change: "15 interviews scheduled", changeType: "neutral" as const, icon: <Users className="w-5 h-5" /> },
    { title: "Hired", value: "23", change: "+5 this month", changeType: "positive" as const, icon: <UserCheck className="w-5 h-5" /> },
  ];

  const applicationTrend = [
    { week: "W1", applications: 52 }, { week: "W2", applications: 68 }, { week: "W3", applications: 75 },
    { week: "W4", applications: 82 }, { week: "W5", applications: 95 }, { week: "W6", applications: 110 },
  ];

  const topVacancies = [
    { title: "Frontend Developer", applications: 85, status: "Active" },
    { title: "Backend Engineer", applications: 72, status: "Active" },
    { title: "Data Analyst", applications: 58, status: "Active" },
    { title: "DevOps Engineer", applications: 45, status: "Closing Soon" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Recruitment Dashboard 💼" description="Track your job postings, applications, and hiring pipeline" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {companyStats.map((s) => <StatCard key={s.title} {...s} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Application Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={applicationTrend}>
              <defs><linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(152, 55%, 50%)" stopOpacity={0.2} /><stop offset="95%" stopColor="hsl(152, 55%, 50%)" stopOpacity={0} /></linearGradient></defs>
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(220, 9%, 46%)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(220, 9%, 46%)' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="applications" stroke="hsl(152, 55%, 50%)" fill="url(#colorApps)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Top Vacancies</h3>
          <div className="space-y-3">
            {topVacancies.map((v) => (
              <div key={v.title} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
                <div className="flex-1">
                  <p className="text-sm font-medium">{v.title}</p>
                  <p className="text-xs text-muted-foreground">{v.applications} applications</p>
                </div>
                <StatusBadge variant={v.status === "Active" ? "success" : "warning"}>{v.status}</StatusBadge>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ============= Main Dashboard Router =============
export default function DashboardPage() {
  const { user } = useAuth();
  
  if (!user) return null;

  switch (user.role) {
    case "platform_owner":
      return <PlatformDashboard />;
    case "consultancy_owner":
      return <ConsultancyDashboard />;
    case "company":
      return <CompanyDashboard />;
    case "student":
      return <StudentDashboard />;
    default:
      return <InstituteDashboard />;
  }
}
