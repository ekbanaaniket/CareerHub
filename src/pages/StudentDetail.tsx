// ============= Student Detail — Full Profile with Courses, Fees, Tests, Attendance, Placements =============
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatCard } from "@/components/common/StatCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft, GraduationCap, FileText, Briefcase, TrendingUp, Award,
  BarChart3, Mail, Phone, MapPin, DollarSign, CalendarCheck, BookOpen,
  Clock, CheckCircle2, AlertCircle, XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { fetchStudents } from "@/services/students";
import { fetchStudentSubmissions } from "@/services/testSubmissions";
import { fetchPlacements } from "@/services/placements";
import { fetchFees, type FeeRecord } from "@/services/fees";
import { fetchAttendance, type AttendanceRecord } from "@/services/attendance";
import { fetchCourses } from "@/services/courses";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useMemo } from "react";
import type { Course } from "@/types";

const PIE_COLORS = ["hsl(142,71%,45%)", "hsl(0,84%,60%)", "hsl(38,92%,50%)", "hsl(220,9%,70%)"];

export default function StudentDetail() {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const { data: students } = useQuery({
    queryKey: ["students"],
    queryFn: () => fetchStudents(),
    select: (res) => res.data,
  });

  const student = students?.find((s) => s.id === studentId);

  const { data: submissions } = useQuery({
    queryKey: ["studentSubmissions", studentId],
    queryFn: () => fetchStudentSubmissions(studentId!),
    select: (res) => res.data,
    enabled: !!studentId,
  });

  const { data: placements } = useQuery({
    queryKey: ["placements"],
    queryFn: () => fetchPlacements(),
    select: (res) => res.data,
  });

  const { data: allFees } = useQuery({
    queryKey: ["fees"],
    queryFn: () => fetchFees(),
    select: (res) => res.data,
  });

  const { data: allAttendance } = useQuery({
    queryKey: ["attendance"],
    queryFn: () => fetchAttendance(),
    select: (res) => res.data,
  });

  const { data: allCourses } = useQuery({
    queryKey: ["courses"],
    queryFn: () => fetchCourses(),
    select: (res) => res.data,
  });

  // Filter data for this student
  const studentPlacements = placements?.filter((p) => p.studentId === studentId) || [];
  const studentFees = allFees?.filter((f) => f.studentId === studentId) || [];
  const studentAttendance = allAttendance?.filter((a) => a.studentId === studentId) || [];

  // Courses this student is registered in (match by course name)
  const enrolledCourses = useMemo(() => {
    if (!allCourses || !student) return [];
    // Student has one course field, but could have submissions in multiple courses
    const courseNames = new Set<string>();
    courseNames.add(student.course);
    submissions?.forEach((s) => courseNames.add(s.course));
    return allCourses.filter((c) => courseNames.has(c.name));
  }, [allCourses, student, submissions]);

  // Group submissions by course
  const submissionsByCourse = useMemo(() => {
    if (!submissions) return {};
    return submissions.reduce((acc, sub) => {
      if (!acc[sub.course]) acc[sub.course] = [];
      acc[sub.course].push(sub);
      return acc;
    }, {} as Record<string, typeof submissions>);
  }, [submissions]);

  // Group placements by company
  const placementsByCompany = useMemo(() => {
    return studentPlacements.reduce((acc, p) => {
      if (!acc[p.company]) acc[p.company] = [];
      acc[p.company].push(p);
      return acc;
    }, {} as Record<string, typeof studentPlacements>);
  }, [studentPlacements]);

  // Group fees by course
  const feesByCourse = useMemo(() => {
    return studentFees.reduce((acc, f) => {
      if (!acc[f.courseName]) acc[f.courseName] = [];
      acc[f.courseName].push(f);
      return acc;
    }, {} as Record<string, FeeRecord[]>);
  }, [studentFees]);

  // Group attendance by course
  const attendanceByCourse = useMemo(() => {
    return studentAttendance.reduce((acc, a) => {
      if (!acc[a.courseName]) acc[a.courseName] = [];
      acc[a.courseName].push(a);
      return acc;
    }, {} as Record<string, AttendanceRecord[]>);
  }, [studentAttendance]);

  // Attendance summary
  const attendanceSummary = useMemo(() => {
    const total = studentAttendance.length;
    const present = studentAttendance.filter((a) => a.status === "present").length;
    const late = studentAttendance.filter((a) => a.status === "late").length;
    const absent = studentAttendance.filter((a) => a.status === "absent").length;
    const excused = studentAttendance.filter((a) => a.status === "excused").length;
    return { total, present, late, absent, excused, pct: total ? Math.round(((present + late) / total) * 100) : 0 };
  }, [studentAttendance]);

  // Fee summary
  const feeSummary = useMemo(() => {
    const totalAmount = studentFees.reduce((a, f) => a + f.amount, 0);
    const paidAmount = studentFees.reduce((a, f) => a + f.paidAmount, 0);
    const pending = totalAmount - paidAmount;
    const overdue = studentFees.filter((f) => f.status === "overdue").reduce((a, f) => a + f.amount, 0);
    return { totalAmount, paidAmount, pending, overdue };
  }, [studentFees]);

  // Performance chart data
  const chartData = submissions?.map((s) => ({
    test: s.testName.length > 15 ? s.testName.slice(0, 15) + "…" : s.testName,
    score: s.percentage,
  })) || [];

  const avgScore = submissions?.length
    ? Math.round(submissions.reduce((a, s) => a + s.percentage, 0) / submissions.length)
    : 0;

  if (!student) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
        <p className="text-muted-foreground text-center py-12">Student not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Students
      </Button>

      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xl font-bold shrink-0">
            {student.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold font-display">{student.name}</h2>
            <p className="text-sm text-muted-foreground">{student.id} · {student.course} · {student.batch}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{student.email}</span>
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{student.phone}</span>
              {student.city && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{student.city}</span>}
            </div>
          </div>
          <StatusBadge variant={student.status === "active" ? "success" : student.status === "inactive" ? "warning" : "destructive"}>
            {student.status}
          </StatusBadge>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard title="Progress" value={`${student.progress}%`} icon={<TrendingUp className="w-5 h-5" />} change={student.course} changeType={student.progress >= 70 ? "positive" : "neutral"} />
        <StatCard title="Courses" value={String(enrolledCourses.length)} icon={<GraduationCap className="w-5 h-5" />} change="enrolled" changeType="neutral" />
        <StatCard title="Tests" value={String(submissions?.length || 0)} icon={<FileText className="w-5 h-5" />} change={`Avg: ${avgScore}%`} changeType={avgScore >= 70 ? "positive" : "negative"} />
        <StatCard title="Attendance" value={`${attendanceSummary.pct}%`} icon={<CalendarCheck className="w-5 h-5" />} change={`${attendanceSummary.present + attendanceSummary.late}/${attendanceSummary.total} days`} changeType={attendanceSummary.pct >= 75 ? "positive" : "negative"} />
        <StatCard title="Fees Paid" value={`$${feeSummary.paidAmount.toLocaleString()}`} icon={<DollarSign className="w-5 h-5" />} change={feeSummary.pending > 0 ? `$${feeSummary.pending.toLocaleString()} pending` : "All clear"} changeType={feeSummary.pending > 0 ? "negative" : "positive"} />
        <StatCard title="Placements" value={String(studentPlacements.length)} icon={<Briefcase className="w-5 h-5" />} change={studentPlacements.filter((p) => p.status === "placed").length + " placed"} changeType="neutral" />
      </div>

      <Tabs defaultValue="courses">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="courses"><GraduationCap className="w-4 h-4 mr-1" /> Courses</TabsTrigger>
          <TabsTrigger value="tests"><FileText className="w-4 h-4 mr-1" /> Tests</TabsTrigger>
          <TabsTrigger value="attendance"><CalendarCheck className="w-4 h-4 mr-1" /> Attendance</TabsTrigger>
          <TabsTrigger value="fees"><DollarSign className="w-4 h-4 mr-1" /> Fees</TabsTrigger>
          <TabsTrigger value="placements"><Briefcase className="w-4 h-4 mr-1" /> Placements</TabsTrigger>
          <TabsTrigger value="performance"><BarChart3 className="w-4 h-4 mr-1" /> Performance</TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-4 mt-4">
          {enrolledCourses.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground text-sm">No course enrollments found</p>
          ) : (
            enrolledCourses.map((c) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl border border-border shadow-card p-5 hover:shadow-elevated transition-shadow cursor-pointer"
                onClick={() => navigate(`/courses/${c.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold font-display">{c.name}</h3>
                      <p className="text-xs text-muted-foreground">{c.startDate} — {c.endDate}</p>
                    </div>
                  </div>
                  <StatusBadge variant={c.status === "active" ? "success" : c.status === "upcoming" ? "info" : "default"}>{c.status}</StatusBadge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{c.description}</p>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Module Progress</span>
                  <span className="font-medium">{c.completedModules}/{c.modules}</span>
                </div>
                <Progress value={(c.completedModules / c.modules) * 100} className="h-2" />
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {c.topics.slice(0, 5).map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-md bg-secondary text-xs text-muted-foreground">{t}</span>
                  ))}
                  {c.topics.length > 5 && <span className="text-xs text-muted-foreground">+{c.topics.length - 5} more</span>}
                </div>
              </motion.div>
            ))
          )}
        </TabsContent>

        {/* Tests Tab — grouped by course */}
        <TabsContent value="tests" className="space-y-6 mt-4">
          {Object.keys(submissionsByCourse).length === 0 ? (
            <p className="text-center py-8 text-muted-foreground text-sm">No test submissions yet</p>
          ) : (
            Object.entries(submissionsByCourse).map(([course, subs]) => {
              const courseAvg = Math.round(subs.reduce((a, s) => a + s.percentage, 0) / subs.length);
              return (
                <div key={course}>
                  <h3 className="text-sm font-semibold font-display mb-3 flex items-center gap-2 text-primary">
                    <GraduationCap className="w-4 h-4" /> {course}
                    <span className="text-muted-foreground font-normal">({subs.length} tests · Avg: {courseAvg}%)</span>
                  </h3>
                  <DataTable headers={["Test", "Score", "Percentage", "Grade", "Time Taken", "Date"]}>
                    {subs.map((s) => (
                      <tr key={s.id} className="hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => navigate(`/tests/${s.testId}`)}>
                        <td className="px-4 py-3 text-sm font-medium">{s.testName}</td>
                        <td className="px-4 py-3 text-sm">{s.score}/{s.maxMarks}</td>
                        <td className="px-4 py-3 text-sm font-bold">{s.percentage}%</td>
                        <td className="px-4 py-3">
                          <StatusBadge variant={s.percentage >= 80 ? "success" : s.percentage >= 60 ? "info" : "warning"}>{s.grade}</StatusBadge>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{s.timeTaken}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{s.submittedAt}</td>
                      </tr>
                    ))}
                  </DataTable>
                </div>
              );
            })
          )}
        </TabsContent>

        {/* Attendance Tab — grouped by course */}
        <TabsContent value="attendance" className="space-y-6 mt-4">
          {/* Attendance summary pie */}
          {studentAttendance.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5">
              <h3 className="text-sm font-semibold font-display mb-4">Attendance Overview</h3>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Present", value: attendanceSummary.present },
                        { name: "Absent", value: attendanceSummary.absent },
                        { name: "Late", value: attendanceSummary.late },
                        { name: "Excused", value: attendanceSummary.excused },
                      ]}
                      cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={2}
                    >
                      {PIE_COLORS.map((color, i) => <Cell key={i} fill={color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Present: {attendanceSummary.present}</div>
                  <div className="flex items-center gap-2"><XCircle className="w-4 h-4 text-destructive" /> Absent: {attendanceSummary.absent}</div>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-warning" /> Late: {attendanceSummary.late}</div>
                  <div className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-muted-foreground" /> Excused: {attendanceSummary.excused}</div>
                </div>
              </div>
            </motion.div>
          )}

          {Object.keys(attendanceByCourse).length === 0 ? (
            <p className="text-center py-8 text-muted-foreground text-sm">No attendance records found</p>
          ) : (
            Object.entries(attendanceByCourse).map(([course, records]) => (
              <div key={course}>
                <h3 className="text-sm font-semibold font-display mb-3 flex items-center gap-2 text-primary">
                  <GraduationCap className="w-4 h-4" /> {course}
                  <span className="text-muted-foreground font-normal">({records.length} records)</span>
                </h3>
                <DataTable headers={["Date", "Status", "Check In", "Check Out"]}>
                  {records.sort((a, b) => b.date.localeCompare(a.date)).map((r) => (
                    <tr key={r.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 text-sm">{r.date}</td>
                      <td className="px-4 py-3">
                        <StatusBadge variant={r.status === "present" ? "success" : r.status === "late" ? "warning" : r.status === "absent" ? "destructive" : "default"}>
                          {r.status}
                        </StatusBadge>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{r.checkInTime || "—"}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{r.checkOutTime || "—"}</td>
                    </tr>
                  ))}
                </DataTable>
              </div>
            ))
          )}
        </TabsContent>

        {/* Fees Tab — grouped by course */}
        <TabsContent value="fees" className="space-y-6 mt-4">
          {/* Fee summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-bold font-display">${feeSummary.totalAmount.toLocaleString()}</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <p className="text-xs text-muted-foreground">Paid</p>
              <p className="text-lg font-bold font-display text-success">${feeSummary.paidAmount.toLocaleString()}</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-lg font-bold font-display text-warning">${feeSummary.pending.toLocaleString()}</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <p className="text-xs text-muted-foreground">Overdue</p>
              <p className="text-lg font-bold font-display text-destructive">${feeSummary.overdue.toLocaleString()}</p>
            </div>
          </div>

          {Object.keys(feesByCourse).length === 0 ? (
            <p className="text-center py-8 text-muted-foreground text-sm">No fee records found</p>
          ) : (
            Object.entries(feesByCourse).map(([course, fees]) => (
              <div key={course}>
                <h3 className="text-sm font-semibold font-display mb-3 flex items-center gap-2 text-primary">
                  <GraduationCap className="w-4 h-4" /> {course}
                  <span className="text-muted-foreground font-normal">({fees.length} records)</span>
                </h3>
                <DataTable headers={["Type", "Amount", "Paid", "Due Date", "Status", "Method"]}>
                  {fees.map((f) => (
                    <tr key={f.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium capitalize">{f.type}</td>
                      <td className="px-4 py-3 text-sm font-bold">${f.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm">${f.paidAmount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{f.dueDate}</td>
                      <td className="px-4 py-3">
                        <StatusBadge variant={f.status === "paid" ? "success" : f.status === "pending" ? "warning" : f.status === "overdue" ? "destructive" : "info"}>
                          {f.status}
                        </StatusBadge>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{f.paymentMethod || "—"}</td>
                    </tr>
                  ))}
                </DataTable>
              </div>
            ))
          )}
        </TabsContent>

        {/* Placements Tab — grouped by company */}
        <TabsContent value="placements" className="space-y-6 mt-4">
          {Object.keys(placementsByCompany).length === 0 ? (
            <p className="text-center py-8 text-muted-foreground text-sm">No placement records</p>
          ) : (
            Object.entries(placementsByCompany).map(([company, plcs]) => (
              <div key={company}>
                <h3 className="text-sm font-semibold font-display mb-3 flex items-center gap-2 text-primary">
                  <Briefcase className="w-4 h-4" /> {company}
                </h3>
                <DataTable headers={["Position", "Package", "City", "Date", "Status"]}>
                  {plcs.map((p) => (
                    <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium">{p.position}</td>
                      <td className="px-4 py-3 text-sm font-bold text-primary">{p.package}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{p.city}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{p.date}</td>
                      <td className="px-4 py-3">
                        <StatusBadge variant={p.status === "placed" ? "success" : p.status === "offered" ? "info" : p.status === "interviewing" ? "warning" : "destructive"}>
                          {p.status}
                        </StatusBadge>
                      </td>
                    </tr>
                  ))}
                </DataTable>
              </div>
            ))
          )}
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="mt-4 space-y-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5">
            <h3 className="text-sm font-semibold font-display mb-4">Test Performance Across Courses</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData}>
                  <XAxis dataKey="test" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                  <Bar dataKey="score" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center py-8 text-muted-foreground text-sm">No performance data available</p>
            )}
          </motion.div>

          {/* Per-course performance summary */}
          {Object.entries(submissionsByCourse).length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(submissionsByCourse).map(([course, subs]) => {
                const avg = Math.round(subs.reduce((a, s) => a + s.percentage, 0) / subs.length);
                const best = Math.max(...subs.map((s) => s.percentage));
                const worst = Math.min(...subs.map((s) => s.percentage));
                return (
                  <div key={course} className="bg-card rounded-xl border border-border p-4">
                    <h4 className="text-sm font-semibold font-display mb-2">{course}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Tests Taken</span><span className="font-medium">{subs.length}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Average</span><span className="font-bold">{avg}%</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Best</span><span className="font-medium text-success">{best}%</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Worst</span><span className="font-medium text-destructive">{worst}%</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
