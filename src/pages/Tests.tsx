import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Clock, Users, CheckCircle, AlertCircle, BarChart3, Calendar, Eye } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCanManage } from "@/hooks/useCanManage";
import { ActionMenu } from "@/components/common/ActionMenu";

const tests = [
  { id: "T001", name: "JavaScript Fundamentals", type: "Quiz", course: "Full-Stack 2026", date: "Mar 5, 2026", duration: "30 min", questions: 25, maxMarks: 100, status: "upcoming", submissions: 0, avgScore: null },
  { id: "T002", name: "React & TypeScript Mid-Term", type: "Exam", course: "Full-Stack 2026", date: "Mar 8, 2026", duration: "2 hrs", questions: 50, maxMarks: 200, status: "upcoming", submissions: 0, avgScore: null },
  { id: "T003", name: "HTML/CSS Basics", type: "Quiz", course: "Frontend Bootcamp", date: "Feb 28, 2026", duration: "20 min", questions: 20, maxMarks: 50, status: "completed", submissions: 42, avgScore: 78 },
  { id: "T004", name: "Node.js API Design", type: "Exam", course: "Backend Mastery", date: "Feb 25, 2026", duration: "1.5 hrs", questions: 35, maxMarks: 150, status: "completed", submissions: 38, avgScore: 72 },
  { id: "T005", name: "Git & GitHub Workflow", type: "Quiz", course: "Full-Stack 2026", date: "Feb 20, 2026", duration: "15 min", questions: 15, maxMarks: 30, status: "completed", submissions: 45, avgScore: 85 },
  { id: "T006", name: "Database Design", type: "Assignment", course: "Full-Stack 2026", date: "Mar 15, 2026", duration: "3 days", questions: 5, maxMarks: 100, status: "draft", submissions: 0, avgScore: null },
  { id: "T007", name: "TypeScript Advanced", type: "Quiz", course: "Full-Stack 2026", date: "Mar 1, 2026", duration: "25 min", questions: 20, maxMarks: 80, status: "in_progress", submissions: 28, avgScore: null },
];

export default function Tests() {
  const { isViewOnly } = useCanManage();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = tests.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === "all" || t.status === tab;
    return matchSearch && matchTab;
  });

  const statusVariant = (s: string) => {
    switch (s) {
      case "completed": return "success";
      case "upcoming": return "info";
      case "in_progress": return "warning";
      case "draft": return "outline";
      default: return "default" as const;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tests & Exams"
        description="Create, manage, and track assessments"
        actions={!isViewOnly ? (
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Create Test</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle className="font-display">Create New Test</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-2">
                <div><Label>Test Name</Label><Input placeholder="e.g., JavaScript Fundamentals Quiz" className="mt-1" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Type</Label>
                    <Select><SelectTrigger className="mt-1"><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quiz">Quiz</SelectItem>
                        <SelectItem value="exam">Exam</SelectItem>
                        <SelectItem value="assignment">Assignment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Course</Label>
                    <Select><SelectTrigger className="mt-1"><SelectValue placeholder="Select course" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fullstack">Full-Stack 2026</SelectItem>
                        <SelectItem value="frontend">Frontend Bootcamp</SelectItem>
                        <SelectItem value="backend">Backend Mastery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div><Label>Date</Label><Input type="date" className="mt-1" /></div>
                  <div><Label>Duration</Label><Input placeholder="30 min" className="mt-1" /></div>
                  <div><Label>Max Marks</Label><Input type="number" placeholder="100" className="mt-1" /></div>
                </div>
                <div><Label>Description</Label><Textarea placeholder="Brief description of the test..." className="mt-1" /></div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setCreateOpen(false)}>Save as Draft</Button>
                  <Button className="flex-1" onClick={() => setCreateOpen(false)}>Publish</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ) : undefined}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Tests", value: tests.length, icon: BarChart3, color: "text-primary bg-primary/10" },
          { label: "Upcoming", value: tests.filter(t => t.status === "upcoming").length, icon: Calendar, color: "text-info bg-info/10" },
          { label: "In Progress", value: tests.filter(t => t.status === "in_progress").length, icon: Clock, color: "text-warning bg-warning/10" },
          { label: "Completed", value: tests.filter(t => t.status === "completed").length, icon: CheckCircle, color: "text-success bg-success/10" },
        ].map((s) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}>
              <s.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-lg font-bold font-display">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search tests..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="in_progress">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Table */}
      <DataTable headers={["Test", "Type", "Course", "Date", "Duration", "Questions", "Submissions", "Avg Score", "Status", ""]}>
        {filtered.map(t => (
          <tr key={t.id} className="hover:bg-secondary/30 transition-colors">
            <td className="px-4 py-3 cursor-pointer" onClick={() => navigate(`/tests/${t.id}`)}>
              <p className="text-sm font-medium">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.id}</p>
            </td>
            <td className="px-4 py-3"><StatusBadge variant={t.type === "Exam" ? "destructive" : t.type === "Quiz" ? "default" : "warning"}>{t.type}</StatusBadge></td>
            <td className="px-4 py-3 text-sm">{t.course}</td>
            <td className="px-4 py-3 text-sm text-muted-foreground">{t.date}</td>
            <td className="px-4 py-3 text-sm text-muted-foreground">{t.duration}</td>
            <td className="px-4 py-3 text-sm text-center">{t.questions}</td>
            <td className="px-4 py-3 text-sm text-center">{t.submissions}/{t.type === "Exam" ? "38" : "45"}</td>
            <td className="px-4 py-3 text-sm text-center font-medium">{t.avgScore ? `${t.avgScore}%` : "—"}</td>
            <td className="px-4 py-3"><StatusBadge variant={statusVariant(t.status) as any}>{t.status.replace("_", " ")}</StatusBadge></td>
            <td className="px-4 py-3">
              <ActionMenu actions={[
                { label: "View Details", icon: Eye, onClick: () => navigate(`/tests/${t.id}`) },
              ]} />
            </td>
          </tr>
        ))}
        {filtered.length === 0 && (
          <tr><td colSpan={10} className="px-4 py-12 text-center text-muted-foreground text-sm">No tests found</td></tr>
        )}
      </DataTable>
    </div>
  );
}
