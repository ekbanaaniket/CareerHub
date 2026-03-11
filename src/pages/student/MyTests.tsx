// ============= Student: My Tests (Grouped by Institute) =============
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatCard } from "@/components/common/StatCard";
import { DataTable } from "@/components/common/DataTable";
import { EntityGroupCard, EntityGroupSkeleton, LazyItemList, type EntityGroupInfo } from "@/components/common/EntityGroupCard";
import { useStudentTests, useStudentInstitutes } from "@/hooks/useStudentData";
import { BarChart3, CheckCircle, Calendar, FileText } from "lucide-react";
import type { StudentTest } from "@/services/studentData";

function TestRow({ test }: { test: StudentTest }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <FileText className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium truncate">{test.name}</p>
          <StatusBadge variant={test.type === "Exam" ? "destructive" : "default"} className="text-[10px]">{test.type}</StatusBadge>
        </div>
        <p className="text-xs text-muted-foreground">{test.course} · {test.date} · {test.duration}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-medium">{test.myScore !== null ? `${test.myScore}/${test.maxMarks}` : "—"}</p>
        <StatusBadge variant={test.status === "completed" ? "success" : test.status === "upcoming" ? "info" : "warning"}>
          {test.status.replace("_", " ")}
        </StatusBadge>
      </div>
    </div>
  );
}

export default function MyTests() {
  const { data: tests, grouped, isLoading } = useStudentTests();
  const { data: institutes } = useStudentInstitutes();

  if (isLoading || !tests) return <EntityGroupSkeleton count={2} />;

  const completed = tests.filter(t => t.status === "completed");
  const avgScore = completed.length > 0
    ? Math.round(completed.reduce((s, t) => s + ((t.myScore ?? 0) / t.maxMarks * 100), 0) / completed.length)
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader title="My Tests & Exams" description="Your test scores and upcoming exams, grouped by institute" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard title="Total Tests" value={String(tests.length)} change={`${Object.keys(grouped).length} institutes`} changeType="neutral" icon={<BarChart3 className="w-5 h-5" />} />
        <StatCard title="Completed" value={String(completed.length)} change="Tests taken" changeType="positive" icon={<CheckCircle className="w-5 h-5" />} />
        <StatCard title="Upcoming" value={String(tests.filter(t => t.status === "upcoming").length)} change="Get ready!" changeType="neutral" icon={<Calendar className="w-5 h-5" />} />
        <StatCard title="Avg Score" value={`${avgScore}%`} change="Overall" changeType="positive" icon={<BarChart3 className="w-5 h-5" />} />
      </div>

      <div className="space-y-4">
        {Object.entries(grouped).map(([instId, group]) => {
          const inst = institutes?.find(i => i.id === instId);
          const entity: EntityGroupInfo = {
            id: instId, name: group.instituteName, type: "institute",
            logo: inst?.logo ?? "IN", subtitle: inst?.location,
            meta: [
              { label: "Tests", value: group.tests.length },
              { label: "Completed", value: group.tests.filter(t => t.status === "completed").length },
            ],
          };
          return (
            <EntityGroupCard key={instId} entity={entity}>
              <LazyItemList
                items={group.tests}
                initialCount={4}
                renderItem={(test) => <TestRow key={test.id} test={test} />}
              />
            </EntityGroupCard>
          );
        })}
      </div>
    </div>
  );
}
