import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EntityGroupFilter, MOCK_INSTITUTES } from "@/components/common/EntityGroupFilter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Clock, Users, CheckCircle, BarChart3, Calendar, Building2 } from "lucide-react";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTests, useCreateTest } from "@/hooks/useTests";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { z } from "zod";
import { ReusableForm, FormInput, FormSelect, FormTextarea } from "@/components/forms";

const testSchema = z.object({
  name: z.string().min(1, "Test name is required"),
  type: z.string().min(1, "Select a type"),
  course: z.string().min(1, "Select a course"),
  date: z.string().min(1, "Date is required"),
  duration: z.string().min(1, "Duration is required"),
  maxMarks: z.string().min(1, "Max marks required"),
  description: z.string().optional(),
});

type TestFormValues = z.infer<typeof testSchema>;

export default function TestsPage() {
  const { currentInstitute } = useApp();
  const { user } = useAuth();
  const isPlatformOwner = user?.role === "platform_owner";

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [entityFilter, setEntityFilter] = useState("all");

  const instituteIdParam = isPlatformOwner
    ? (entityFilter !== "all" ? entityFilter : undefined)
    : currentInstitute.id;

  const { data: tests, isLoading } = useTests({ search, status: tab, instituteId: instituteIdParam });
  const createMutation = useCreateTest();

  // Group tests by institute for platform owner
  const groupedTests = useMemo(() => {
    if (!isPlatformOwner || !tests || entityFilter !== "all") return null;
    const groups: Record<string, { instituteName: string; tests: typeof tests }> = {};
    for (const t of tests) {
      const instId = t.instituteId ?? "unknown";
      const instName = MOCK_INSTITUTES.find((i) => i.id === instId)?.name ?? `Institute ${instId}`;
      if (!groups[instId]) groups[instId] = { instituteName: instName, tests: [] };
      groups[instId].tests.push(t);
    }
    return groups;
  }, [isPlatformOwner, tests, entityFilter]);

  const handleCreate = async (values: TestFormValues) => {
    try {
      await createMutation.mutateAsync({
        name: values.name, type: values.type as any, course: values.course,
        date: values.date, duration: values.duration, questions: 0,
        maxMarks: parseInt(values.maxMarks), status: "upcoming", submissions: 0,
        avgScore: null, instituteId: currentInstitute.id,
      });
      toast.success("Test published successfully");
      setCreateOpen(false);
    } catch { toast.error("Failed to create test"); }
  };

  const statusVariant = (s: string) => {
    switch (s) { case "completed": return "success"; case "upcoming": return "info"; case "in_progress": return "warning"; case "draft": return "outline"; default: return "default" as const; }
  };

  const allTests = tests ?? [];
  const statItems = [
    { label: "Total Tests", value: allTests.length, icon: BarChart3, color: "text-primary bg-primary/10" },
    { label: "Upcoming", value: allTests.filter((t) => t.status === "upcoming").length, icon: Calendar, color: "text-info bg-info/10" },
    { label: "In Progress", value: allTests.filter((t) => t.status === "in_progress").length, icon: Clock, color: "text-warning bg-warning/10" },
    { label: "Completed", value: allTests.filter((t) => t.status === "completed").length, icon: CheckCircle, color: "text-success bg-success/10" },
  ];

  const renderTestRows = (testList: typeof allTests) => testList.map((t) => (
    <tr key={t.id} className="hover:bg-secondary/30 transition-colors">
      <td className="px-4 py-3"><p className="text-sm font-medium">{t.name}</p><p className="text-xs text-muted-foreground">{t.id}</p></td>
      <td className="px-4 py-3"><StatusBadge variant={t.type === "Exam" ? "destructive" : t.type === "Quiz" ? "default" : "warning"}>{t.type}</StatusBadge></td>
      <td className="px-4 py-3 text-sm">{t.course}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{t.date}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{t.duration}</td>
      <td className="px-4 py-3 text-sm text-center">{t.questions}</td>
      <td className="px-4 py-3 text-sm text-center">{t.submissions}</td>
      <td className="px-4 py-3 text-sm text-center font-medium">{t.avgScore ? `${t.avgScore}%` : "—"}</td>
      <td className="px-4 py-3"><StatusBadge variant={statusVariant(t.status) as any}>{t.status.replace("_", " ")}</StatusBadge></td>
    </tr>
  ));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tests & Exams"
        description={isPlatformOwner ? "View all tests across institutes" : "Create, manage, and track assessments"}
        actions={
          !isPlatformOwner ? (
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-1" /> Create Test</Button></DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle className="font-display">Create New Test</DialogTitle></DialogHeader>
                <ReusableForm schema={testSchema} defaultValues={{ name: "", type: "", course: "", date: "", duration: "", maxMarks: "", description: "" }} onSubmit={handleCreate} submitLabel="Publish" isLoading={createMutation.isPending}>
                  {(form) => (
                    <>
                      <FormInput form={form} name="name" label="Test Name" placeholder="e.g., JavaScript Fundamentals Quiz" />
                      <div className="grid grid-cols-2 gap-4">
                        <FormSelect form={form} name="type" label="Type" placeholder="Select type" options={[
                          { value: "Quiz", label: "Quiz" }, { value: "Exam", label: "Exam" }, { value: "Assignment", label: "Assignment" },
                        ]} />
                        <FormSelect form={form} name="course" label="Course" placeholder="Select course" options={[
                          { value: "Full-Stack 2026", label: "Full-Stack 2026" },
                          { value: "Frontend Bootcamp", label: "Frontend Bootcamp" },
                          { value: "Backend Mastery", label: "Backend Mastery" },
                        ]} />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <FormInput form={form} name="date" label="Date" type="date" />
                        <FormInput form={form} name="duration" label="Duration" placeholder="30 min" />
                        <FormInput form={form} name="maxMarks" label="Max Marks" type="number" placeholder="100" />
                      </div>
                      <FormTextarea form={form} name="description" label="Description" placeholder="Brief description..." />
                    </>
                  )}
                </ReusableForm>
              </DialogContent>
            </Dialog>
          ) : undefined
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)
          : statItems.map((s) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}><s.icon className="w-4 h-4" /></div>
                <div>
                  <p className="text-lg font-bold font-display">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </motion.div>
            ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {isPlatformOwner && (
          <EntityGroupFilter label="Institutes" entities={MOCK_INSTITUTES} selected={entityFilter} onSelect={setEntityFilter} />
        )}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search tests..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
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

      {isLoading ? (
        <Skeleton className="h-64 rounded-xl" />
      ) : isPlatformOwner && groupedTests ? (
        <div className="space-y-6">
          {Object.entries(groupedTests).map(([instId, group]) => (
            <div key={instId} className="space-y-2">
              <h3 className="text-sm font-semibold font-display flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-primary" />
                {group.instituteName}
                <span className="text-xs font-normal">({group.tests.length} tests)</span>
              </h3>
              <DataTable headers={["Test", "Type", "Course", "Date", "Duration", "Questions", "Submissions", "Avg Score", "Status"]}>
                {renderTestRows(group.tests)}
              </DataTable>
            </div>
          ))}
          {Object.keys(groupedTests).length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">No tests found</div>
          )}
        </div>
      ) : (
        <DataTable headers={["Test", "Type", "Course", "Date", "Duration", "Questions", "Submissions", "Avg Score", "Status"]}>
          {renderTestRows(allTests)}
          {allTests.length === 0 && (
            <tr><td colSpan={9} className="px-4 py-12 text-center text-muted-foreground text-sm">No tests found</td></tr>
          )}
        </DataTable>
      )}
    </div>
  );
}
