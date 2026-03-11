// ============= Student: My Progress (Read-Only) =============
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { TrendingUp, Award, Target, BarChart3 } from "lucide-react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

const subjectScores = [
  { subject: "JavaScript", score: 85 },
  { subject: "React", score: 78 },
  { subject: "TypeScript", score: 82 },
  { subject: "Node.js", score: 70 },
  { subject: "Git", score: 92 },
  { subject: "CSS", score: 88 },
];

const radarData = [
  { metric: "Attendance", value: 92 },
  { metric: "Assignments", value: 85 },
  { metric: "Quizzes", value: 78 },
  { metric: "Exams", value: 72 },
  { metric: "Projects", value: 90 },
  { metric: "Participation", value: 75 },
];

const courseProgress = [
  { name: "Full-Stack 2026", institute: "TechVerse Academy", progress: 78, grade: "A-" },
  { name: "Frontend Bootcamp", institute: "TechVerse Academy", progress: 65, grade: "B+" },
  { name: "React Advanced", institute: "CodeCraft Institute", progress: 30, grade: "B+" },
  { name: "IELTS Preparation", institute: "Global Education Consultancy", progress: 60, grade: "B" },
];

export default function MyProgress() {
  return (
    <div className="space-y-6">
      <PageHeader title="My Progress" description="Your performance across all enrolled courses" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Overall Average" value="82%" change="Rank #3 of 128" changeType="positive" icon={<TrendingUp className="w-5 h-5" />} />
        <StatCard title="Courses Enrolled" value="4" change="3 active, 1 completed" changeType="positive" icon={<Target className="w-5 h-5" />} />
        <StatCard title="Tests Taken" value="5" change="Avg score: 87%" changeType="positive" icon={<BarChart3 className="w-5 h-5" />} />
        <StatCard title="Best Subject" value="Git" change="92% score" changeType="positive" icon={<Award className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Subject Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={subjectScores} layout="vertical">
              <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis dataKey="subject" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} width={80} />
              <Tooltip />
              <Bar dataKey="score" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="text-sm font-semibold font-display mb-4">Performance Radar</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5">
        <h3 className="text-sm font-semibold font-display mb-4">Course Progress</h3>
        <div className="space-y-4">
          {courseProgress.map(c => (
            <div key={c.name} className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium truncate">{c.name}</p>
                  <span className="text-xs font-bold text-primary">{c.grade}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{c.institute}</p>
                <Progress value={c.progress} className="h-2" />
              </div>
              <span className="text-sm font-bold w-12 text-right">{c.progress}%</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
