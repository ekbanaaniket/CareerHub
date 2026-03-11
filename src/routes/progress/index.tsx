// Re-exports the existing progress page with hook-based data
// In a real app, this would use hooks for fetching progress data
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Award, Target } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

const subjectData = [
  { subject: "JavaScript", score: 82 }, { subject: "React", score: 78 },
  { subject: "TypeScript", score: 75 }, { subject: "Node.js", score: 70 },
  { subject: "Git", score: 90 }, { subject: "CSS", score: 85 },
];

const monthlyTrend = [
  { month: "Sep", pass: 85, fail: 15 }, { month: "Oct", pass: 82, fail: 18 },
  { month: "Nov", pass: 88, fail: 12 }, { month: "Dec", pass: 84, fail: 16 },
  { month: "Jan", pass: 90, fail: 10 }, { month: "Feb", pass: 87, fail: 13 },
];

const topStudents = [
  { rank: 1, name: "David Lee", score: 96, trend: "up" },
  { rank: 2, name: "Grace Kim", score: 94, trend: "up" },
  { rank: 3, name: "Bob Smith", score: 91, trend: "same" },
  { rank: 4, name: "Alice Johnson", score: 89, trend: "down" },
  { rank: 5, name: "Henry Brown", score: 87, trend: "up" },
];

const radarData = [
  { metric: "Attendance", value: 88 }, { metric: "Assignments", value: 82 },
  { metric: "Quizzes", value: 78 }, { metric: "Exams", value: 75 },
  { metric: "Projects", value: 85 }, { metric: "Participation", value: 70 },
];

const gradeDistribution = [
  { grade: "A+", count: 45, color: "hsl(152, 55%, 50%)" },
  { grade: "A", count: 120, color: "hsl(152, 55%, 60%)" },
  { grade: "B+", count: 180, color: "hsl(224, 76%, 63%)" },
  { grade: "B", count: 250, color: "hsl(224, 76%, 73%)" },
  { grade: "C", count: 150, color: "hsl(38, 92%, 50%)" },
  { grade: "D", count: 60, color: "hsl(0, 72%, 60%)" },
  { grade: "F", count: 25, color: "hsl(0, 72%, 45%)" },
];

export default function ProgressPage() {
  const [course, setCourse] = useState("all");
  const [period, setPeriod] = useState("monthly");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Progress Reports"
        description="Comprehensive analytics on student performance"
        actions={
          <div className="flex gap-2">
            <Select value={course} onValueChange={setCourse}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="fullstack">Full-Stack 2026</SelectItem>
                <SelectItem value="frontend">Frontend Bootcamp</SelectItem>
              </SelectContent>
            </Select>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Overall Pass Rate" value="87%" change="+3% from last month" changeType="positive" icon={<Target className="w-5 h-5" />} />
        <StatCard title="Average Score" value="78.5" change="+2.1 points" changeType="positive" icon={<TrendingUp className="w-5 h-5" />} />
        <StatCard title="Top Performer" value="David Lee" change="96% average" changeType="positive" icon={<Award className="w-5 h-5" />} />
        <StatCard title="At Risk Students" value="12" change="Need attention" changeType="negative" icon={<TrendingDown className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Performance by Subject</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={subjectData} layout="vertical">
              <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(220, 9%, 46%)' }} />
              <YAxis dataKey="subject" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(220, 9%, 46%)' }} width={80} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="score" fill="hsl(224, 76%, 63%)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Batch Performance Radar</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(220, 13%, 91%)" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: 'hsl(220, 9%, 46%)' }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar dataKey="value" stroke="hsl(224, 76%, 63%)" fill="hsl(224, 76%, 63%)" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Pass/Fail Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyTrend}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(220, 9%, 46%)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(220, 9%, 46%)' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="pass" stroke="hsl(152, 55%, 50%)" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="fail" stroke="hsl(0, 72%, 60%)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Top Performers</h3>
          <div className="space-y-3">
            {topStudents.map((s) => (
              <div key={s.rank} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${s.rank <= 3 ? "gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>{s.rank}</div>
                <div className="flex-1"><p className="text-sm font-medium">{s.name}</p></div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{s.score}%</span>
                  {s.trend === "up" && <TrendingUp className="w-3.5 h-3.5 text-success" />}
                  {s.trend === "down" && <TrendingDown className="w-3.5 h-3.5 text-destructive" />}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl border border-border shadow-card p-5">
        <h3 className="text-sm font-semibold font-display mb-4">Grade Distribution</h3>
        <div className="flex items-center gap-6 flex-wrap">
          {gradeDistribution.map((g) => (
            <div key={g.grade} className="text-center">
              <div className="w-12 rounded-t-md mx-auto" style={{ height: `${g.count / 3}px`, backgroundColor: g.color }} />
              <p className="text-xs font-bold mt-1">{g.grade}</p>
              <p className="text-xs text-muted-foreground">{g.count}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
