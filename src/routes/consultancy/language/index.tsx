import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EntityGroupFilter, MOCK_CONSULTANCIES } from "@/components/common/EntityGroupFilter";
import { CollapsibleEntityGroup, ShowMoreList } from "@/components/common/CollapsibleEntityGroup";
import { Button } from "@/components/ui/button";
import { Plus, Languages, Users, Calendar, Clock } from "lucide-react";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguageCourses, useCreateLanguageCourse } from "@/hooks/useConsultancy";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { z } from "zod";
import { ReusableForm, FormInput, FormSelect } from "@/components/forms";
import { useCanManage } from "@/hooks/useCanManage";

const langSchema = z.object({
  name: z.string().min(1),
  language: z.string().min(1),
  level: z.string().min(1),
  instructor: z.string().min(1),
  schedule: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  testType: z.string().optional(),
});

const statusColors: Record<string, string> = { active: "success", upcoming: "info", completed: "outline" };
const levelColors: Record<string, string> = { beginner: "info", intermediate: "warning", advanced: "destructive" };

export default function LanguageCoursesPage() {
  const { currentInstitute } = useApp();
  const { user } = useAuth();
  const isPlatformOwner = user?.role === "platform_owner";
  const { isViewOnly } = useCanManage();
  const [createOpen, setCreateOpen] = useState(false);
  const [entityFilter, setEntityFilter] = useState("all");

  const instituteIdParam = isPlatformOwner
    ? (entityFilter !== "all" ? entityFilter : undefined)
    : currentInstitute.id;

  const { data: courses, isLoading } = useLanguageCourses(instituteIdParam);
  const createMutation = useCreateLanguageCourse();

  const groupedCourses = useMemo(() => {
    if (!isPlatformOwner || !courses || entityFilter !== "all") return null;
    const groups: Record<string, { name: string; items: typeof courses }> = {};
    for (const c of courses) {
      const conId = (c as any).consultancyId ?? c.instituteId ?? "unknown";
      const conName = MOCK_CONSULTANCIES.find((con) => con.id === conId)?.name ?? `Consultancy ${conId}`;
      if (!groups[conId]) groups[conId] = { name: conName, items: [] };
      groups[conId].items.push(c);
    }
    return groups;
  }, [isPlatformOwner, courses, entityFilter]);

  const handleCreate = async (values: z.infer<typeof langSchema>) => {
    try {
      await createMutation.mutateAsync({
        name: values.name!,
        language: values.language!,
        level: values.level as any,
        instructor: values.instructor!,
        schedule: values.schedule!,
        startDate: values.startDate!,
        endDate: values.endDate!,
        testType: (values.testType as any) || undefined,
        students: 0,
        status: "upcoming",
        instituteId: currentInstitute.id,
      });
      toast.success("Course created");
      setCreateOpen(false);
    } catch {
      toast.error("Failed to create");
    }
  };

  const renderCard = (course: any) => (
    <motion.div key={course.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border border-border shadow-card p-5 space-y-3"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold font-display">{course.name}</h3>
          <p className="text-xs text-muted-foreground">{course.language}</p>
        </div>
        <div className="flex gap-1">
          <StatusBadge variant={statusColors[course.status] as any}>{course.status}</StatusBadge>
          <StatusBadge variant={levelColors[course.level] as any}>{course.level}</StatusBadge>
        </div>
      </div>
      <div className="space-y-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5"><Users className="w-3 h-3" /> {course.students} students • {course.instructor}</div>
        <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {course.schedule}</div>
        <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {course.startDate} → {course.endDate}</div>
      </div>
      {course.testType && (
        <div className="flex items-center gap-1.5">
          <Languages className="w-3 h-3 text-primary" />
          <span className="text-xs font-medium text-primary">{course.testType} Preparation</span>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Language Courses"
        description={isPlatformOwner ? "View language courses across all consultancies" : "Manage language preparation and test prep courses"}
        actions={!isViewOnly ? (
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="w-4 h-4 mr-1" /> New Course</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-display">New Language Course</DialogTitle></DialogHeader>
              <ReusableForm schema={langSchema} defaultValues={{ name: "", language: "", level: "beginner", instructor: "", schedule: "", startDate: "", endDate: "", testType: "" }} onSubmit={handleCreate} submitLabel="Create" isLoading={createMutation.isPending}>
                {(form) => (
                  <>
                    <FormInput form={form} name="name" label="Course Name" placeholder="e.g., IELTS Prep Batch A" />
                    <FormSelect form={form} name="language" label="Language" options={[
                      { label: "English", value: "English" }, { label: "German", value: "German" },
                      { label: "French", value: "French" }, { label: "Japanese", value: "Japanese" },
                      { label: "Korean", value: "Korean" }, { label: "Spanish", value: "Spanish" },
                    ]} />
                    <FormSelect form={form} name="level" label="Level" options={[
                      { label: "Beginner", value: "beginner" }, { label: "Intermediate", value: "intermediate" }, { label: "Advanced", value: "advanced" },
                    ]} />
                    <FormInput form={form} name="instructor" label="Instructor" />
                    <FormInput form={form} name="schedule" label="Schedule" placeholder="e.g., Mon, Wed, Fri - 10 AM" />
                    <FormInput form={form} name="startDate" label="Start Date" placeholder="YYYY-MM-DD" />
                    <FormInput form={form} name="endDate" label="End Date" placeholder="YYYY-MM-DD" />
                    <FormSelect form={form} name="testType" label="Test Type (Optional)" options={[
                      { label: "None", value: "" }, { label: "IELTS", value: "IELTS" }, { label: "TOEFL", value: "TOEFL" },
                      { label: "PTE", value: "PTE" }, { label: "Duolingo", value: "Duolingo" },
                      { label: "JLPT", value: "JLPT" }, { label: "DELF", value: "DELF" }, { label: "Goethe", value: "Goethe" },
                    ]} />
                  </>
                )}
              </ReusableForm>
            </DialogContent>
          </Dialog>
        ) : undefined}
      />

      {isPlatformOwner && (
        <EntityGroupFilter label="Consultancies" entities={MOCK_CONSULTANCIES} selected={entityFilter} onSelect={setEntityFilter} icon="consultancy" />
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)}
        </div>
      ) : isPlatformOwner && groupedCourses ? (
        <div className="space-y-6">
          {Object.entries(groupedCourses).map(([conId, group]) => (
            <CollapsibleEntityGroup key={conId} entityName={group.name} entityType="consultancy" count={group.items.length}>
              <ShowMoreList
                items={group.items}
                initialCount={4}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                renderItem={renderCard}
              />
            </CollapsibleEntityGroup>
          ))}
          {Object.keys(groupedCourses).length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">No courses found</div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses?.map(renderCard)}
        </div>
      )}
    </div>
  );
}
