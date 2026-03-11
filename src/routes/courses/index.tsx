import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EntityGroupFilter, MOCK_INSTITUTES } from "@/components/common/EntityGroupFilter";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GraduationCap, Users, BookOpen, Plus, ChevronRight, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCourses, useCreateCourse } from "@/hooks/useCourses";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { z } from "zod";
import { ReusableForm, FormInput, FormSelect, FormTextarea } from "@/components/forms";
import { useState, useMemo } from "react";

const courseSchema = z.object({
  name: z.string().min(1, "Course name is required"),
  description: z.string().min(1, "Description is required"),
  modules: z.string().min(1, "Number of modules required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  topics: z.string().min(1, "At least one topic required"),
  status: z.string().min(1, "Status is required"),
});

type CourseFormValues = z.infer<typeof courseSchema>;

export default function CoursesPage() {
  const { currentInstitute } = useApp();
  const { user } = useAuth();
  const isPlatformOwner = user?.role === "platform_owner";

  const [createOpen, setCreateOpen] = useState(false);
  const [entityFilter, setEntityFilter] = useState("all");

  const instituteIdParam = isPlatformOwner
    ? (entityFilter !== "all" ? entityFilter : undefined)
    : currentInstitute.id;

  const { data: courses, isLoading } = useCourses(instituteIdParam);
  const createMutation = useCreateCourse();

  // Group courses by institute for platform owner
  const groupedCourses = useMemo(() => {
    if (!isPlatformOwner || !courses || entityFilter !== "all") return null;
    const groups: Record<string, { instituteName: string; courses: typeof courses }> = {};
    for (const c of courses) {
      const instId = c.instituteId ?? "unknown";
      const instName = MOCK_INSTITUTES.find((i) => i.id === instId)?.name ?? `Institute ${instId}`;
      if (!groups[instId]) groups[instId] = { instituteName: instName, courses: [] };
      groups[instId].courses.push(c);
    }
    return groups;
  }, [isPlatformOwner, courses, entityFilter]);

  const handleCreate = async (values: CourseFormValues) => {
    try {
      await createMutation.mutateAsync({
        name: values.name, description: values.description, students: 0,
        modules: parseInt(values.modules), completedModules: 0, status: values.status as any,
        startDate: values.startDate, endDate: values.endDate,
        topics: values.topics.split(",").map((t) => t.trim()).filter(Boolean),
        instituteId: currentInstitute.id,
      });
      toast.success("Course created successfully");
      setCreateOpen(false);
    } catch { toast.error("Failed to create course"); }
  };

  const renderCourseCard = (c: any) => (
    <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5 hover:shadow-elevated transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center"><GraduationCap className="w-5 h-5 text-primary-foreground" /></div>
          <div>
            <h3 className="text-sm font-semibold font-display">{c.name}</h3>
            <p className="text-xs text-muted-foreground">{c.startDate} — {c.endDate}</p>
          </div>
        </div>
        <StatusBadge variant={c.status === "active" ? "success" : c.status === "completed" ? "default" : "info"}>{c.status}</StatusBadge>
      </div>
      <p className="text-xs text-muted-foreground mb-4">{c.description}</p>
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{c.completedModules}/{c.modules} modules</span>
        </div>
        <Progress value={(c.completedModules / c.modules) * 100} className="h-2" />
      </div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {c.topics.map((t: string) => (
          <span key={t} className="px-2 py-0.5 rounded-md bg-secondary text-xs text-muted-foreground">{t}</span>
        ))}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {c.students} students</span>
          <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {c.modules} modules</span>
        </div>
        <Button variant="ghost" size="sm" className="text-xs">View <ChevronRight className="w-3.5 h-3.5 ml-1" /></Button>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses"
        description={isPlatformOwner ? "View all courses across institutes" : "Manage course curriculum and enrollment"}
        actions={
          !isPlatformOwner ? (
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-1" /> Create Course</Button></DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle className="font-display">Create New Course</DialogTitle></DialogHeader>
                <ReusableForm schema={courseSchema} defaultValues={{ name: "", description: "", modules: "", startDate: "", endDate: "", topics: "", status: "upcoming" }} onSubmit={handleCreate} submitLabel="Create Course" isLoading={createMutation.isPending}>
                  {(form) => (
                    <>
                      <FormInput form={form} name="name" label="Course Name" placeholder="Full-Stack Developer 2026" />
                      <FormTextarea form={form} name="description" label="Description" placeholder="Course description..." />
                      <div className="grid grid-cols-3 gap-4">
                        <FormInput form={form} name="modules" label="Modules" type="number" placeholder="24" />
                        <FormInput form={form} name="startDate" label="Start" placeholder="Jan 2026" />
                        <FormInput form={form} name="endDate" label="End" placeholder="Jun 2026" />
                      </div>
                      <FormInput form={form} name="topics" label="Topics (comma-separated)" placeholder="React, Node.js, Docker" />
                      <FormSelect form={form} name="status" label="Status" options={[
                        { value: "upcoming", label: "Upcoming" }, { value: "active", label: "Active" }, { value: "completed", label: "Completed" },
                      ]} />
                    </>
                  )}
                </ReusableForm>
              </DialogContent>
            </Dialog>
          ) : undefined
        }
      />

      {isPlatformOwner && (
        <div className="flex gap-3">
          <EntityGroupFilter label="Institutes" entities={MOCK_INSTITUTES} selected={entityFilter} onSelect={setEntityFilter} />
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-52 rounded-xl" />)}
        </div>
      ) : isPlatformOwner && groupedCourses ? (
        <div className="space-y-6">
          {Object.entries(groupedCourses).map(([instId, group]) => (
            <div key={instId} className="space-y-3">
              <h3 className="text-sm font-semibold font-display flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-primary" />
                {group.instituteName}
                <span className="text-xs font-normal">({group.courses.length} courses)</span>
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {group.courses.map(renderCourseCard)}
              </div>
            </div>
          ))}
          {Object.keys(groupedCourses).length === 0 && (
            <div className="col-span-2 text-center py-12 text-muted-foreground text-sm">No courses found</div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {courses?.map(renderCourseCard)}
          {(!courses || courses.length === 0) && (
            <div className="col-span-2 text-center py-12 text-muted-foreground text-sm">No courses found</div>
          )}
        </div>
      )}
    </div>
  );
}
