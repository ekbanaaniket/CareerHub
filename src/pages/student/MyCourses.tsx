// ============= Student: My Courses (Grouped by Institute) =============
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { EntityGroupCard, EntityGroupSkeleton, LazyItemList, type EntityGroupInfo } from "@/components/common/EntityGroupCard";
import { useStudentCourses, useStudentInstitutes } from "@/hooks/useStudentData";
import { GraduationCap, Clock } from "lucide-react";
import type { StudentCourse } from "@/services/studentData";

function CourseCard({ course }: { course: StudentCourse }) {
  return (
    <div className="bg-secondary/30 rounded-lg border border-border p-4 hover:bg-secondary/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold font-display">{course.name}</h3>
            <p className="text-xs text-muted-foreground">{course.instructor}</p>
          </div>
        </div>
        <StatusBadge variant={course.grade.startsWith("A") ? "success" : "default"}>{course.grade}</StatusBadge>
      </div>
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{course.completed}/{course.modules} modules</span>
        </div>
        <Progress value={course.progress} className="h-2" />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.nextClass}</span>
        <StatusBadge variant={course.status === "active" ? "success" : "info"}>{course.status}</StatusBadge>
      </div>
    </div>
  );
}

export default function MyCourses() {
  const { data: courses, grouped, isLoading } = useStudentCourses();
  const { data: institutes } = useStudentInstitutes();

  if (isLoading || !courses) return <EntityGroupSkeleton count={2} />;

  return (
    <div className="space-y-6">
      <PageHeader title="My Courses" description="All courses you are enrolled in, grouped by institute" />

      <div className="space-y-4">
        {Object.entries(grouped).map(([instId, group]) => {
          const inst = institutes?.find(i => i.id === instId);
          const entity: EntityGroupInfo = {
            id: instId,
            name: group.instituteName,
            type: "institute",
            logo: inst?.logo ?? instId.slice(0, 2).toUpperCase(),
            subtitle: inst?.location,
            meta: [
              { label: "Courses", value: group.courses.length },
              { label: "Active", value: group.courses.filter(c => c.status === "active").length },
            ],
          };

          return (
            <EntityGroupCard key={instId} entity={entity}>
              <LazyItemList
                items={group.courses}
                initialCount={4}
                className="grid grid-cols-1 lg:grid-cols-2 gap-3"
                renderItem={(course) => <CourseCard key={course.id} course={course} />}
              />
            </EntityGroupCard>
          );
        })}
      </div>
    </div>
  );
}
