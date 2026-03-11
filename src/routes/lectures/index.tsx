import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EntityGroupFilter, MOCK_INSTITUTES } from "@/components/common/EntityGroupFilter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Video, Search, Play, Users, Plus, Calendar, Building2 } from "lucide-react";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useLectures, useCreateLecture } from "@/hooks/useLectures";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { z } from "zod";
import { ReusableForm, FormInput, FormSelect } from "@/components/forms";

const lectureSchema = z.object({
  title: z.string().min(1, "Title is required"),
  instructor: z.string().min(1, "Instructor is required"),
  date: z.string().min(1, "Date is required"),
  module: z.string().min(1, "Module is required"),
  status: z.string().min(1, "Status is required"),
  duration: z.string().optional(),
});

type LectureFormValues = z.infer<typeof lectureSchema>;

export default function LecturesPage() {
  const { currentInstitute } = useApp();
  const { user } = useAuth();
  const isPlatformOwner = user?.role === "platform_owner";

  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);

  const instituteIdParam = isPlatformOwner
    ? (entityFilter !== "all" ? entityFilter : undefined)
    : currentInstitute.id;

  const { data: lectures, isLoading } = useLectures({ search, instituteId: instituteIdParam });
  const createMutation = useCreateLecture();

  // Group lectures by institute for platform owner
  const groupedLectures = useMemo(() => {
    if (!isPlatformOwner || !lectures || entityFilter !== "all") return null;
    const groups: Record<string, { instituteName: string; lectures: typeof lectures }> = {};
    for (const l of lectures) {
      const instId = l.instituteId ?? "unknown";
      const instName = MOCK_INSTITUTES.find((i) => i.id === instId)?.name ?? `Institute ${instId}`;
      if (!groups[instId]) groups[instId] = { instituteName: instName, lectures: [] };
      groups[instId].lectures.push(l);
    }
    return groups;
  }, [isPlatformOwner, lectures, entityFilter]);

  const handleCreate = async (values: LectureFormValues) => {
    try {
      await createMutation.mutateAsync({
        title: values.title,
        instructor: values.instructor,
        duration: values.duration || "—",
        date: values.date,
        views: 0,
        status: values.status as any,
        module: values.module,
        instituteId: currentInstitute.id,
      });
      toast.success("Lecture scheduled successfully");
      setCreateOpen(false);
    } catch {
      toast.error("Failed to schedule lecture");
    }
  };

  const renderLectureCard = (lec: any) => (
    <motion.div key={lec.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card overflow-hidden hover:shadow-elevated transition-all group">
      <div className="relative h-36 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
          {lec.status === "recorded" ? <Play className="w-5 h-5 text-primary ml-0.5" /> : <Calendar className="w-5 h-5 text-primary" />}
        </div>
        <div className="absolute top-2 right-2">
          <StatusBadge variant={lec.status === "recorded" ? "success" : lec.status === "upcoming" ? "warning" : "info"}>{lec.status}</StatusBadge>
        </div>
        {lec.duration !== "—" && (
          <div className="absolute bottom-2 right-2 bg-foreground/80 text-background text-xs px-2 py-0.5 rounded">{lec.duration}</div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{lec.module}</p>
        <h3 className="text-sm font-semibold font-display mb-2 line-clamp-2">{lec.title}</h3>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{lec.instructor}</span>
          <span className="flex items-center gap-1">{lec.status === "recorded" ? <><Users className="w-3 h-3" /> {lec.views}</> : lec.date}</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lectures"
        description={isPlatformOwner ? "View all lectures across institutes" : "Recorded and upcoming lecture sessions"}
        actions={
          !isPlatformOwner ? (
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Schedule Lecture</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle className="font-display">Schedule New Lecture</DialogTitle></DialogHeader>
                <ReusableForm
                  schema={lectureSchema}
                  defaultValues={{ title: "", instructor: "", date: "", module: "", status: "scheduled", duration: "" }}
                  onSubmit={handleCreate}
                  submitLabel="Schedule Lecture"
                  isLoading={createMutation.isPending}
                >
                  {(form) => (
                    <>
                      <FormInput form={form} name="title" label="Lecture Title" placeholder="Introduction to React Hooks" />
                      <div className="grid grid-cols-2 gap-4">
                        <FormSelect form={form} name="instructor" label="Instructor" options={[
                          { value: "John Doe", label: "John Doe" },
                          { value: "Jane Smith", label: "Jane Smith" },
                        ]} />
                        <FormSelect form={form} name="status" label="Status" options={[
                          { value: "scheduled", label: "Scheduled" },
                          { value: "upcoming", label: "Upcoming" },
                          { value: "recorded", label: "Recorded" },
                        ]} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormInput form={form} name="date" label="Date" placeholder="Mar 10, 2026" />
                        <FormInput form={form} name="module" label="Module" placeholder="Week 9" />
                      </div>
                      <FormInput form={form} name="duration" label="Duration (optional)" placeholder="2h 00m" />
                    </>
                  )}
                </ReusableForm>
              </DialogContent>
            </Dialog>
          ) : undefined
        }
      />

      <div className="flex flex-col sm:flex-row gap-3">
        {isPlatformOwner && (
          <EntityGroupFilter label="Institutes" entities={MOCK_INSTITUTES} selected={entityFilter} onSelect={setEntityFilter} />
        )}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search lectures..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-60 rounded-xl" />)}
        </div>
      ) : isPlatformOwner && groupedLectures ? (
        <div className="space-y-6">
          {Object.entries(groupedLectures).map(([instId, group]) => (
            <div key={instId} className="space-y-3">
              <h3 className="text-sm font-semibold font-display flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-primary" />
                {group.instituteName}
                <span className="text-xs font-normal">({group.lectures.length} lectures)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {group.lectures.map(renderLectureCard)}
              </div>
            </div>
          ))}
          {Object.keys(groupedLectures).length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">No lectures found</div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {lectures?.map(renderLectureCard)}
          {(!lectures || lectures.length === 0) && (
            <div className="col-span-full text-center py-12 text-muted-foreground text-sm">No lectures found</div>
          )}
        </div>
      )}
    </div>
  );
}
