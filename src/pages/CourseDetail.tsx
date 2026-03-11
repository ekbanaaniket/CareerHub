// ============= Course Detail — Students, Tests, Leaderboard =============
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatCard } from "@/components/common/StatCard";
import { ActionMenu } from "@/components/common/ActionMenu";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, GraduationCap, BookOpen, TrendingUp, Eye, Mail, Phone, BarChart3, Award } from "lucide-react";
import { motion } from "framer-motion";
import { fetchStudents } from "@/services/students";
import { fetchCourses } from "@/services/courses";
import { fetchAllSubmissions } from "@/services/testSubmissions";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { data: allCourses } = useQuery({
    queryKey: ["courses"],
    queryFn: () => fetchCourses(),
    select: (res) => res.data,
  });

  const course = allCourses?.find((c) => c.id === courseId);

  const { data: allStudents } = useQuery({
    queryKey: ["students"],
    queryFn: () => fetchStudents(),
    select: (res) => res.data,
  });

  const { data: allSubmissions } = useQuery({
    queryKey: ["allSubmissions"],
    queryFn: () => fetchAllSubmissions(),
    select: (res) => res.data,
  });

  // Students enrolled in this course (match by course name)
  const enrolledStudents = useMemo(() => {
    if (!allStudents || !course) return [];
    return allStudents.filter((s) => s.course === course.name);
  }, [allStudents, course]);

  // Submissions for this course
  const courseSubmissions = useMemo(() => {
    if (!allSubmissions || !course) return [];
    return allSubmissions.filter((s) => s.course === course.name);
  }, [allSubmissions, course]);

  // Group submissions by test
  const submissionsByTest = useMemo(() => {
    return courseSubmissions.reduce((acc, sub) => {
      if (!acc[sub.testName]) acc[sub.testName] = [];
      acc[sub.testName].push(sub);
      return acc;
    }, {} as Record<string, typeof courseSubmissions>);
  }, [courseSubmissions]);

  // Student performance data
  const studentPerformance = useMemo(() => {
    const perf: Record<string, { name: string; totalScore: number; totalMax: number; tests: number }> = {};
    courseSubmissions.forEach((sub) => {
      if (!perf[sub.studentId]) perf[sub.studentId] = { name: sub.studentName, totalScore: 0, totalMax: 0, tests: 0 };
      perf[sub.studentId].totalScore += sub.score;
      perf[sub.studentId].totalMax += sub.maxMarks;
      perf[sub.studentId].tests += 1;
    });
    return Object.entries(perf)
      .map(([id, p]) => ({ id, ...p, avg: Math.round((p.totalScore / p.totalMax) * 100) }))
      .sort((a, b) => b.avg - a.avg);
  }, [courseSubmissions]);

  const avgProgress = enrolledStudents.length
    ? Math.round(enrolledStudents.reduce((a, s) => a + s.progress, 0) / enrolledStudents.length)
    : 0;
  const activeCount = enrolledStudents.filter((s) => s.status === "active").length;

  if (!course) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
        <p className="text-muted-foreground text-center py-12">Course not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Courses
      </Button>

      {/* Course Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center shrink-0">
            <GraduationCap className="w-7 h-7 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold font-display">{course.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
            <p className="text-xs text-muted-foreground mt-2">{course.startDate} — {course.endDate}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {course.topics.map((t) => (
                <span key={t} className="px-2 py-0.5 rounded-md bg-secondary text-xs text-muted-foreground">{t}</span>
              ))}
            </div>
          </div>
          <StatusBadge variant={course.status === "active" ? "success" : course.status === "upcoming" ? "info" : "default"}>{course.status}</StatusBadge>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Module Progress</span>
            <span className="font-medium">{course.completedModules}/{course.modules} modules</span>
          </div>
          <Progress value={(course.completedModules / course.modules) * 100} className="h-2" />
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Enrolled Students" value={String(enrolledStudents.length)} icon={<Users className="w-5 h-5" />} change={`${activeCount} active`} changeType="positive" />
        <StatCard title="Avg Progress" value={`${avgProgress}%`} icon={<TrendingUp className="w-5 h-5" />} change="course completion" changeType={avgProgress >= 60 ? "positive" : "neutral"} />
        <StatCard title="Tests Conducted" value={String(Object.keys(submissionsByTest).length)} icon={<BookOpen className="w-5 h-5" />} change={`${courseSubmissions.length} submissions`} changeType="neutral" />
        <StatCard title="Top Avg Score" value={studentPerformance[0] ? `${studentPerformance[0].avg}%` : "—"} icon={<Award className="w-5 h-5" />} change={studentPerformance[0]?.name || "N/A"} changeType="positive" />
      </div>

      <Tabs defaultValue="students">
        <TabsList>
          <TabsTrigger value="students"><Users className="w-4 h-4 mr-1" /> Students ({enrolledStudents.length})</TabsTrigger>
          <TabsTrigger value="tests"><BookOpen className="w-4 h-4 mr-1" /> Tests</TabsTrigger>
          <TabsTrigger value="leaderboard"><BarChart3 className="w-4 h-4 mr-1" /> Leaderboard</TabsTrigger>
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students" className="mt-4">
          <DataTable headers={["Student", "Contact", "Batch", "Progress", "Status", "Joined", ""]}>
            {enrolledStudents.map((s) => (
              <tr key={s.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3 cursor-pointer" onClick={() => navigate(`/students/${s.id}`)}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                      {s.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-xs space-y-0.5">
                    <p className="flex items-center gap-1 text-muted-foreground"><Mail className="w-3 h-3" />{s.email}</p>
                    <p className="flex items-center gap-1 text-muted-foreground"><Phone className="w-3 h-3" />{s.phone}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{s.batch}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full gradient-primary transition-all" style={{ width: `${s.progress}%` }} />
                    </div>
                    <span className="text-xs font-medium">{s.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge variant={s.status === "active" ? "success" : s.status === "inactive" ? "warning" : "destructive"}>{s.status}</StatusBadge>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{s.joinDate}</td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <ActionMenu actions={[
                    { label: "View Details", icon: Eye, onClick: () => navigate(`/students/${s.id}`) },
                  ]} />
                </td>
              </tr>
            ))}
            {enrolledStudents.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground text-sm">No students enrolled in this course</td></tr>
            )}
          </DataTable>
        </TabsContent>

        {/* Tests Tab */}
        <TabsContent value="tests" className="space-y-6 mt-4">
          {Object.keys(submissionsByTest).length === 0 ? (
            <p className="text-center py-8 text-muted-foreground text-sm">No tests conducted yet</p>
          ) : (
            Object.entries(submissionsByTest).map(([testName, subs]) => {
              const avgPct = Math.round(subs.reduce((a, s) => a + s.percentage, 0) / subs.length);
              return (
                <div key={testName}>
                  <h3 className="text-sm font-semibold font-display mb-3 flex items-center gap-2 text-primary">
                    <BookOpen className="w-4 h-4" /> {testName}
                    <span className="text-muted-foreground font-normal">({subs.length} submissions · Avg: {avgPct}%)</span>
                  </h3>
                  <DataTable headers={["Student", "Score", "Percentage", "Grade", "Time", "Date"]}>
                    {subs.sort((a, b) => b.percentage - a.percentage).map((s) => (
                      <tr key={s.id} className="hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => navigate(`/students/${s.studentId}`)}>
                        <td className="px-4 py-3 text-sm font-medium">{s.studentName}</td>
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

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="mt-4 space-y-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5">
            <h3 className="text-sm font-semibold font-display mb-4">Student Leaderboard</h3>
            {studentPerformance.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={studentPerformance.slice(0, 10).map((s) => ({ name: s.name.split(" ")[0], avg: s.avg }))}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                    <Bar dataKey="avg" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {studentPerformance.map((s, i) => (
                    <div
                      key={s.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/students/${s.id}`)}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? "gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.tests} tests taken</p>
                      </div>
                      <span className="text-sm font-bold">{s.avg}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center py-8 text-muted-foreground text-sm">No test data available yet</p>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
