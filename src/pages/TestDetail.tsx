// ============= Test Detail Page — Submissions, Top Students, Stats =============
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatCard } from "@/components/common/StatCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Award, TrendingUp, BarChart3, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { fetchTests } from "@/services/tests";
import { fetchTestSubmissions } from "@/services/testSubmissions";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function TestDetail() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const { data: tests } = useQuery({
    queryKey: ["tests"],
    queryFn: () => fetchTests(),
    select: (res) => res.data,
  });

  const test = tests?.find((t) => t.id === testId);

  const { data: submissions } = useQuery({
    queryKey: ["testSubmissions", testId],
    queryFn: () => fetchTestSubmissions(testId!),
    select: (res) => res.data,
    enabled: !!testId,
  });

  if (!test) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
        <p className="text-muted-foreground text-center py-12">Test not found</p>
      </div>
    );
  }

  const sorted = [...(submissions || [])].sort((a, b) => b.percentage - a.percentage);
  const topStudents = sorted.slice(0, 5);
  const avgScore = sorted.length > 0 ? Math.round(sorted.reduce((a, s) => a + s.percentage, 0) / sorted.length) : 0;
  const passCount = sorted.filter((s) => s.percentage >= 50).length;
  const highest = sorted[0]?.percentage ?? 0;

  // Grade distribution
  const gradeMap: Record<string, number> = {};
  sorted.forEach((s) => { gradeMap[s.grade] = (gradeMap[s.grade] || 0) + 1; });
  const gradeData = Object.entries(gradeMap).map(([grade, count]) => ({ grade, count }));
  const COLORS = ["hsl(152,55%,50%)", "hsl(152,55%,60%)", "hsl(224,76%,63%)", "hsl(38,92%,50%)", "hsl(0,72%,60%)", "hsl(0,72%,45%)"];

  // Score distribution buckets
  const buckets = [
    { range: "90-100%", count: sorted.filter((s) => s.percentage >= 90).length },
    { range: "80-89%", count: sorted.filter((s) => s.percentage >= 80 && s.percentage < 90).length },
    { range: "70-79%", count: sorted.filter((s) => s.percentage >= 70 && s.percentage < 80).length },
    { range: "60-69%", count: sorted.filter((s) => s.percentage >= 60 && s.percentage < 70).length },
    { range: "50-59%", count: sorted.filter((s) => s.percentage >= 50 && s.percentage < 60).length },
    { range: "<50%", count: sorted.filter((s) => s.percentage < 50).length },
  ];

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Tests
      </Button>

      <PageHeader
        title={test.name}
        description={`${test.type} · ${test.course} · ${test.date} · Duration: ${test.duration}`}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Submissions" value={String(sorted.length)} icon={<Users className="w-5 h-5" />} change={`of ${test.type === "Exam" ? "38" : "45"} students`} changeType="neutral" />
        <StatCard title="Average Score" value={`${avgScore}%`} icon={<BarChart3 className="w-5 h-5" />} change="class average" changeType={avgScore >= 70 ? "positive" : "negative"} />
        <StatCard title="Highest Score" value={`${highest}%`} icon={<Trophy className="w-5 h-5" />} change={topStudents[0]?.studentName || "—"} changeType="positive" />
        <StatCard title="Pass Rate" value={sorted.length ? `${Math.round((passCount / sorted.length) * 100)}%` : "—"} icon={<TrendingUp className="w-5 h-5" />} change={`${passCount}/${sorted.length} passed`} changeType="positive" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Score Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={buckets}>
              <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(220,9%,46%)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(220,9%,46%)" }} />
              <Tooltip contentStyle={{ background: "hsl(0,0%,100%)", border: "1px solid hsl(220,13%,91%)", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="count" fill="hsl(224,76%,63%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Grade Distribution</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={gradeData} dataKey="count" nameKey="grade" cx="50%" cy="50%" outerRadius={80} label={({ grade, count }) => `${grade}: ${count}`}>
                  {gradeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Top Students */}
      {topStudents.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" /> Top Performers
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {topStudents.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 cursor-pointer hover:bg-secondary/50 transition-colors"
                onClick={() => navigate(`/students/${s.studentId}`)}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{s.studentName}</p>
                  <p className="text-xs text-muted-foreground">{s.score}/{s.maxMarks} ({s.percentage}%)</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* All Submissions Table */}
      <div>
        <h3 className="text-sm font-semibold font-display mb-3">All Submissions ({sorted.length})</h3>
        <DataTable headers={["Rank", "Student", "Score", "Percentage", "Grade", "Time Taken", "Submitted"]}>
          {sorted.map((s, i) => (
            <tr key={s.id} className="hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => navigate(`/students/${s.studentId}`)}>
              <td className="px-4 py-3 text-sm font-bold text-center">{i + 1}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                    {s.studentName.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{s.studentName}</p>
                    <p className="text-xs text-muted-foreground">{s.studentId}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm font-medium">{s.score}/{s.maxMarks}</td>
              <td className="px-4 py-3 text-sm font-bold">{s.percentage}%</td>
              <td className="px-4 py-3">
                <StatusBadge variant={s.percentage >= 80 ? "success" : s.percentage >= 60 ? "info" : s.percentage >= 50 ? "warning" : "destructive"}>
                  {s.grade}
                </StatusBadge>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{s.timeTaken}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{s.submittedAt}</td>
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground text-sm">No submissions yet</td></tr>
          )}
        </DataTable>
      </div>
    </div>
  );
}
