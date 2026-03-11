// ============= Multi-Entity Student Dashboard =============
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useStudentDashboard } from "@/hooks/useStudentDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  GraduationCap, BookOpen, CalendarCheck, CreditCard, Briefcase,
  TrendingUp, Clock, AlertCircle, CheckCircle, FileText,
  Building2, Globe, Plane, University, Languages
} from "lucide-react";
import { useState } from "react";

const itemTypeConfig: Record<string, { icon: typeof Clock; color: string }> = {
  lecture: { icon: BookOpen, color: "text-primary" },
  test: { icon: FileText, color: "text-warning" },
  assignment: { icon: FileText, color: "text-accent" },
  exam: { icon: AlertCircle, color: "text-destructive" },
};

const serviceTypeConfig: Record<string, { icon: typeof Plane; color: string }> = {
  visa: { icon: Plane, color: "text-primary" },
  university: { icon: University, color: "text-accent" },
  language: { icon: Languages, color: "text-warning" },
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useStudentDashboard(user?.id ?? "", user?.instituteId);
  const [mainTab, setMainTab] = useState("academic");

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!data) return <div className="text-center py-12 text-muted-foreground">No data available</div>;

  const institutes = data.registeredEntities.filter(e => e.type === "institute");
  const consultancies = data.registeredEntities.filter(e => e.type === "consultancy");
  const companies = data.registeredEntities.filter(e => e.type === "company");

  const instituteCourses = data.enrolledCourses.filter(c => c.entityType === "institute");
  const consultancyCourses = data.enrolledCourses.filter(c => c.entityType === "consultancy");

  const instituteUpcoming = data.upcomingItems.filter(u => institutes.some(e => e.id === u.entityId));
  const consultancyUpcoming = data.upcomingItems.filter(u => consultancies.some(e => e.id === u.entityId));

  const instituteAttendance = data.attendanceByEntity.filter(a => institutes.some(e => e.id === a.entityId));
  const consultancyAttendance = data.attendanceByEntity.filter(a => consultancies.some(e => e.id === a.entityId));

  const instituteFees = data.feesByEntity.filter(f => institutes.some(e => e.id === f.entityId));
  const consultancyFees = data.feesByEntity.filter(f => consultancies.some(e => e.id === f.entityId));

  const totalFees = data.feesByEntity.reduce((s, f) => s + f.totalFees, 0);
  const totalPaid = data.feesByEntity.reduce((s, f) => s + f.paid, 0);
  const totalPending = data.feesByEntity.reduce((s, f) => s + f.pending, 0);
  const avgAttendance = data.attendanceByEntity.length > 0
    ? Math.round(data.attendanceByEntity.reduce((s, a) => s + a.percentage, 0) / data.attendanceByEntity.length * 10) / 10
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Hello, ${user?.name?.split(" ")[0]} 👋`}
        description="Your learning overview across all registered entities"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Overall Progress" value={`${data.overallProgress}%`} change={`Rank #${data.rank} of ${data.totalStudents}`} changeType="positive" icon={<TrendingUp className="w-5 h-5" />} />
        <StatCard title="Attendance" value={`${avgAttendance}%`} change={`Across ${data.attendanceByEntity.length} entities`} changeType={avgAttendance >= 85 ? "positive" : "negative"} icon={<CalendarCheck className="w-5 h-5" />} />
        <StatCard title="Fees Pending" value={`$${totalPending.toLocaleString()}`} change={`$${totalPaid.toLocaleString()} paid of $${totalFees.toLocaleString()}`} changeType="negative" icon={<CreditCard className="w-5 h-5" />} />
        <StatCard title="Opportunities" value={`${data.placementOpportunities.length}`} change={`${data.placementOpportunities.filter(p => p.status === "open").length} open`} changeType="positive" icon={<Briefcase className="w-5 h-5" />} />
      </div>

      {/* Main Tabs: Academic | Consultancy | Company */}
      <Tabs value={mainTab} onValueChange={setMainTab}>
        <TabsList>
          <TabsTrigger value="academic" className="gap-1.5"><Building2 className="w-3.5 h-3.5" /> Academic ({institutes.length})</TabsTrigger>
          <TabsTrigger value="consultancy" className="gap-1.5"><Globe className="w-3.5 h-3.5" /> Consultancy ({consultancies.length})</TabsTrigger>
          <TabsTrigger value="company" className="gap-1.5"><Briefcase className="w-3.5 h-3.5" /> Company ({companies.length})</TabsTrigger>
        </TabsList>

        {/* ===== ACADEMIC TAB ===== */}
        <TabsContent value="academic" className="space-y-4 mt-4">
          {institutes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">No institutes registered</div>
          ) : (
            <>
              {/* Registered Institutes */}
              <div className="flex flex-wrap gap-2">
                {institutes.map(e => (
                  <div key={e.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="w-6 h-6 rounded-md gradient-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold">{e.logo}</div>
                    <span className="text-xs font-medium">{e.name}</span>
                  </div>
                ))}
              </div>

              {/* Courses */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5">
                <h3 className="text-sm font-semibold font-display flex items-center gap-2 mb-4"><GraduationCap className="w-4 h-4 text-primary" /> Enrolled Courses</h3>
                <div className="space-y-3">
                  {instituteCourses.map((course) => (
                    <div key={course.id} className="p-3 rounded-lg bg-secondary/30 border border-border">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium">{course.name}</p>
                          <p className="text-xs text-muted-foreground">{course.instructor} · <span className="text-primary">{course.entityName}</span></p>
                        </div>
                        <StatusBadge variant={course.grade.startsWith("A") ? "success" : "default"}>{course.grade}</StatusBadge>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={course.progress} className="flex-1 h-2" />
                        <span className="text-xs font-medium text-muted-foreground">{course.progress}%</span>
                      </div>
                      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                        <span>{course.completedModules}/{course.totalModules} modules</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Next: {course.nextClass}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Upcoming & Attendance */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5">
                  <h3 className="text-sm font-semibold font-display flex items-center gap-2 mb-4"><Clock className="w-4 h-4 text-primary" /> Upcoming Schedule</h3>
                  <div className="space-y-2.5">
                    {instituteUpcoming.map((item) => {
                      const cfg = itemTypeConfig[item.type] || itemTypeConfig.lecture;
                      return (
                        <div key={item.id} className="p-2.5 rounded-lg bg-secondary/30 border border-border">
                          <div className="flex items-start gap-2.5">
                            <div className={`mt-0.5 ${cfg.color}`}><cfg.icon className="w-3.5 h-3.5" /></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">{item.title}</p>
                              <p className="text-[10px] text-muted-foreground">{item.course} · {item.entityName}</p>
                              <p className="text-[10px] text-muted-foreground">{item.date} · {item.time}</p>
                            </div>
                            <StatusBadge variant={item.type === "exam" ? "destructive" : item.type === "test" ? "warning" : "outline"}>{item.type}</StatusBadge>
                          </div>
                        </div>
                      );
                    })}
                    {instituteUpcoming.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No upcoming items</p>}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5">
                  <h3 className="text-sm font-semibold font-display flex items-center gap-2 mb-4"><CalendarCheck className="w-4 h-4 text-primary" /> Attendance</h3>
                  <div className="space-y-4">
                    {instituteAttendance.map((att) => (
                      <div key={att.entityId}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium">{att.entityName}</span>
                          <span className="text-xs text-muted-foreground">{att.attended}/{att.totalClasses} ({att.percentage}%)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                            <div key={day} className="flex-1 text-center">
                              <div className={`w-full aspect-square rounded-md flex items-center justify-center ${att.lastWeek[i] ? "bg-success/20" : "bg-destructive/20"}`}>
                                {att.lastWeek[i] ? <CheckCircle className="w-3 h-3 text-success" /> : <AlertCircle className="w-3 h-3 text-destructive" />}
                              </div>
                              <p className="text-[9px] text-muted-foreground mt-0.5">{day}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Fees */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5">
                <h3 className="text-sm font-semibold font-display flex items-center gap-2 mb-4"><CreditCard className="w-4 h-4 text-primary" /> Fee Summary</h3>
                <div className="space-y-3">
                  {instituteFees.map((fee) => (
                    <div key={fee.entityId} className="p-3 rounded-lg bg-secondary/30 border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{fee.entityName}</span>
                        <span className="text-xs text-muted-foreground">Due: {fee.nextDueDate}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-2">
                        <div className="text-center"><p className="text-[10px] text-muted-foreground">Total</p><p className="text-sm font-semibold">${fee.totalFees.toLocaleString()}</p></div>
                        <div className="text-center"><p className="text-[10px] text-muted-foreground">Paid</p><p className="text-sm font-semibold text-success">${fee.paid.toLocaleString()}</p></div>
                        <div className="text-center"><p className="text-[10px] text-muted-foreground">Pending</p><p className="text-sm font-semibold text-destructive">${fee.pending.toLocaleString()}</p></div>
                      </div>
                      <Progress value={(fee.paid / fee.totalFees) * 100} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </TabsContent>

        {/* ===== CONSULTANCY TAB ===== */}
        <TabsContent value="consultancy" className="space-y-4 mt-4">
          {consultancies.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">No consultancies registered</div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                {consultancies.map(e => (
                  <div key={e.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-warning/10 border border-warning/20">
                    <div className="w-6 h-6 rounded-md gradient-warm flex items-center justify-center text-primary-foreground text-[10px] font-bold">{e.logo}</div>
                    <span className="text-xs font-medium">{e.name}</span>
                  </div>
                ))}
              </div>

              {/* Consultancy Services */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5">
                <h3 className="text-sm font-semibold font-display flex items-center gap-2 mb-4"><Globe className="w-4 h-4 text-primary" /> Active Services</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {data.consultancyServices.map((svc) => {
                    const cfg = serviceTypeConfig[svc.type] || serviceTypeConfig.visa;
                    return (
                      <div key={svc.id} className="p-3 rounded-lg bg-secondary/30 border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <cfg.icon className={`w-4 h-4 ${cfg.color}`} />
                          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{svc.type}</span>
                        </div>
                        <p className="text-sm font-medium">{svc.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">Counselor: {svc.counselor}</p>
                        <div className="flex items-center justify-between mt-2">
                          <StatusBadge variant="info">{svc.status}</StatusBadge>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">{svc.nextStep}</p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Consultancy Courses (e.g., IELTS) */}
              {consultancyCourses.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5">
                  <h3 className="text-sm font-semibold font-display flex items-center gap-2 mb-4"><BookOpen className="w-4 h-4 text-primary" /> Language & Prep Courses</h3>
                  <div className="space-y-3">
                    {consultancyCourses.map((course) => (
                      <div key={course.id} className="p-3 rounded-lg bg-secondary/30 border border-border">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm font-medium">{course.name}</p>
                            <p className="text-xs text-muted-foreground">{course.instructor} · {course.entityName}</p>
                          </div>
                          <StatusBadge variant={course.grade.startsWith("A") ? "success" : "default"}>{course.grade}</StatusBadge>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={course.progress} className="flex-1 h-2" />
                          <span className="text-xs font-medium text-muted-foreground">{course.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Consultancy Upcoming */}
              {consultancyUpcoming.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5">
                  <h3 className="text-sm font-semibold font-display flex items-center gap-2 mb-4"><Clock className="w-4 h-4 text-primary" /> Upcoming</h3>
                  <div className="space-y-2.5">
                    {consultancyUpcoming.map((item) => {
                      const cfg = itemTypeConfig[item.type] || itemTypeConfig.lecture;
                      return (
                        <div key={item.id} className="p-2.5 rounded-lg bg-secondary/30 border border-border flex items-start gap-2.5">
                          <div className={`mt-0.5 ${cfg.color}`}><cfg.icon className="w-3.5 h-3.5" /></div>
                          <div className="flex-1">
                            <p className="text-xs font-medium">{item.title}</p>
                            <p className="text-[10px] text-muted-foreground">{item.course} · {item.date} · {item.time}</p>
                          </div>
                          <StatusBadge variant={item.type === "exam" ? "destructive" : "outline"}>{item.type}</StatusBadge>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Consultancy Fees */}
              {consultancyFees.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5">
                  <h3 className="text-sm font-semibold font-display flex items-center gap-2 mb-4"><CreditCard className="w-4 h-4 text-primary" /> Consultancy Fees</h3>
                  <div className="space-y-3">
                    {consultancyFees.map((fee) => (
                      <div key={fee.entityId} className="p-3 rounded-lg bg-secondary/30 border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{fee.entityName}</span>
                          <span className="text-xs text-muted-foreground">Due: {fee.nextDueDate}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mb-2">
                          <div className="text-center"><p className="text-[10px] text-muted-foreground">Total</p><p className="text-sm font-semibold">${fee.totalFees.toLocaleString()}</p></div>
                          <div className="text-center"><p className="text-[10px] text-muted-foreground">Paid</p><p className="text-sm font-semibold text-success">${fee.paid.toLocaleString()}</p></div>
                          <div className="text-center"><p className="text-[10px] text-muted-foreground">Pending</p><p className="text-sm font-semibold text-destructive">${fee.pending.toLocaleString()}</p></div>
                        </div>
                        <Progress value={(fee.paid / fee.totalFees) * 100} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </TabsContent>

        {/* ===== COMPANY TAB ===== */}
        <TabsContent value="company" className="space-y-4 mt-4">
          {companies.length === 0 && data.placementOpportunities.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">No companies or job applications</div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                {companies.map(e => (
                  <div key={e.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 border border-success/20">
                    <div className="w-6 h-6 rounded-md gradient-success flex items-center justify-center text-primary-foreground text-[10px] font-bold">{e.logo}</div>
                    <span className="text-xs font-medium">{e.name}</span>
                  </div>
                ))}
              </div>

              {/* Job Applications */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5">
                <h3 className="text-sm font-semibold font-display flex items-center gap-2 mb-4"><Briefcase className="w-4 h-4 text-primary" /> Job Applications & Opportunities</h3>
                <div className="space-y-2.5">
                  {data.placementOpportunities.map((opp) => (
                    <div key={opp.id} className="p-3 rounded-lg bg-secondary/30 border border-border flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{opp.position}</p>
                        <p className="text-xs text-muted-foreground">{opp.company} · {opp.salary}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Deadline: {opp.deadline}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <StatusBadge variant={opp.status === "shortlisted" ? "success" : opp.status === "applied" ? "info" : "outline"}>{opp.status}</StatusBadge>
                        <StatusBadge variant="outline">{opp.type}</StatusBadge>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
