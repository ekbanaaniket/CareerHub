import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EntityGroupFilter, MOCK_CONSULTANCIES } from "@/components/common/EntityGroupFilter";
import { CollapsibleEntityGroup, ShowMoreList } from "@/components/common/CollapsibleEntityGroup";
import { Button } from "@/components/ui/button";
import { Plus, GraduationCap, Globe, Calendar, User, Award } from "lucide-react";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useUniversityApplications, useCreateUniversity } from "@/hooks/useConsultancy";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { z } from "zod";
import { ReusableForm, FormInput, FormSelect } from "@/components/forms";
import { useCanManage } from "@/hooks/useCanManage";

const uniSchema = z.object({
  studentName: z.string().min(1),
  universityName: z.string().min(1),
  country: z.string().min(1),
  program: z.string().min(1),
  intake: z.string().min(1),
  deadline: z.string().min(1),
});

const statusColors: Record<string, string> = {
  shortlisted: "outline",
  applied: "info",
  offer_received: "success",
  accepted: "success",
  rejected: "destructive",
  enrolled: "default",
};

export default function UniversityApplicationsPage() {
  const { currentInstitute } = useApp();
  const { user } = useAuth();
  const isPlatformOwner = user?.role === "platform_owner";
  const { isViewOnly } = useCanManage();
  const [createOpen, setCreateOpen] = useState(false);
  const [entityFilter, setEntityFilter] = useState("all");

  const instituteIdParam = isPlatformOwner
    ? (entityFilter !== "all" ? entityFilter : undefined)
    : currentInstitute.id;

  const { data: applications, isLoading } = useUniversityApplications(instituteIdParam);
  const createMutation = useCreateUniversity();

  const groupedApps = useMemo(() => {
    if (!isPlatformOwner || !applications || entityFilter !== "all") return null;
    const groups: Record<string, { name: string; items: typeof applications }> = {};
    for (const app of applications) {
      const conId = app.consultancyId ?? app.instituteId ?? "unknown";
      const conName = MOCK_CONSULTANCIES.find((c) => c.id === conId)?.name ?? `Consultancy ${conId}`;
      if (!groups[conId]) groups[conId] = { name: conName, items: [] };
      groups[conId].items.push(app);
    }
    return groups;
  }, [isPlatformOwner, applications, entityFilter]);

  const handleCreate = async (values: z.infer<typeof uniSchema>) => {
    try {
      await createMutation.mutateAsync({
        studentName: values.studentName!,
        universityName: values.universityName!,
        country: values.country!,
        program: values.program!,
        intake: values.intake!,
        deadline: values.deadline!,
        studentId: `S${Date.now()}`,
        status: "shortlisted",
        appliedDate: new Date().toISOString().split("T")[0],
        scholarshipApplied: false,
        counselorId: "C1",
        counselorName: "Dr. Anita Sharma",
        instituteId: currentInstitute.id,
      });
      toast.success("Application created");
      setCreateOpen(false);
    } catch {
      toast.error("Failed to create");
    }
  };

  const renderCard = (app: any) => (
    <motion.div key={app.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border border-border shadow-card p-5 space-y-3"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold font-display">{app.studentName}</h3>
            <p className="text-xs text-muted-foreground">{app.universityName}</p>
          </div>
        </div>
        <StatusBadge variant={statusColors[app.status] as any}>{app.status.replace("_", " ")}</StatusBadge>
      </div>
      <div className="space-y-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5"><GraduationCap className="w-3 h-3" /> {app.program}</div>
        <div className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> {app.country} • {app.intake}</div>
        <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Deadline: {app.deadline}</div>
        <div className="flex items-center gap-1.5"><User className="w-3 h-3" /> {app.counselorName}</div>
      </div>
      {app.scholarshipApplied && (
        <div className="flex items-center gap-1.5 text-xs">
          <Award className="w-3 h-3 text-warning" />
          <span>Scholarship: </span>
          <StatusBadge variant={app.scholarshipStatus === "approved" ? "success" : app.scholarshipStatus === "rejected" ? "destructive" : "warning"}>
            {app.scholarshipStatus}
          </StatusBadge>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="University Applications"
        description={isPlatformOwner ? "View university applications across all consultancies" : "Track student university applications and admissions"}
        actions={!isViewOnly ? (
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="w-4 h-4 mr-1" /> New Application</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-display">New University Application</DialogTitle></DialogHeader>
              <ReusableForm schema={uniSchema} defaultValues={{ studentName: "", universityName: "", country: "", program: "", intake: "", deadline: "" }} onSubmit={handleCreate} submitLabel="Create" isLoading={createMutation.isPending}>
                {(form) => (
                  <>
                    <FormInput form={form} name="studentName" label="Student Name" />
                    <FormInput form={form} name="universityName" label="University" placeholder="e.g., University of Oxford" />
                    <FormSelect form={form} name="country" label="Country" options={[
                      { label: "UK", value: "United Kingdom" }, { label: "USA", value: "United States" },
                      { label: "Canada", value: "Canada" }, { label: "Australia", value: "Australia" },
                      { label: "Germany", value: "Germany" },
                    ]} />
                    <FormInput form={form} name="program" label="Program" placeholder="e.g., MSc Computer Science" />
                    <FormInput form={form} name="intake" label="Intake" placeholder="e.g., Fall 2026" />
                    <FormInput form={form} name="deadline" label="Deadline" placeholder="YYYY-MM-DD" />
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
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
        </div>
      ) : isPlatformOwner && groupedApps ? (
        <div className="space-y-6">
          {Object.entries(groupedApps).map(([conId, group]) => (
            <CollapsibleEntityGroup key={conId} entityName={group.name} entityType="consultancy" count={group.items.length}>
              <ShowMoreList
                items={group.items}
                initialCount={4}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                renderItem={renderCard}
              />
            </CollapsibleEntityGroup>
          ))}
          {Object.keys(groupedApps).length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">No applications found</div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {applications?.map(renderCard)}
        </div>
      )}
    </div>
  );
}
