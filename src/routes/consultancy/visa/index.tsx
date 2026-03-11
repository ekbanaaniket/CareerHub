import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EntityGroupFilter, MOCK_CONSULTANCIES } from "@/components/common/EntityGroupFilter";
import { CollapsibleEntityGroup, ShowMoreList } from "@/components/common/CollapsibleEntityGroup";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Globe, Calendar, User } from "lucide-react";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useVisaApplications, useCreateVisa, useUpdateVisa } from "@/hooks/useConsultancy";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { z } from "zod";
import { ReusableForm, FormInput, FormSelect, FormTextarea } from "@/components/forms";
import { useCanManage } from "@/hooks/useCanManage";

const visaSchema = z.object({
  studentName: z.string().min(1, "Student name is required"),
  country: z.string().min(1, "Country is required"),
  visaType: z.string().min(1, "Visa type is required"),
  notes: z.string().default(""),
});

const statusColors: Record<string, string> = {
  pending: "warning",
  documents_submitted: "info",
  interview_scheduled: "default",
  processing: "info",
  approved: "success",
  rejected: "destructive",
};

export default function VisaTrackingPage() {
  const { currentInstitute } = useApp();
  const { user } = useAuth();
  const isPlatformOwner = user?.role === "platform_owner";
  const { isViewOnly } = useCanManage();
  const [createOpen, setCreateOpen] = useState(false);
  const [entityFilter, setEntityFilter] = useState("all");

  const instituteIdParam = isPlatformOwner
    ? (entityFilter !== "all" ? entityFilter : undefined)
    : currentInstitute.id;

  const { data: applications, isLoading } = useVisaApplications(instituteIdParam);
  const createMutation = useCreateVisa();
  const updateMutation = useUpdateVisa();

  // Group by consultancy for platform owner
  const groupedApps = useMemo(() => {
    if (!isPlatformOwner || !applications || entityFilter !== "all") return null;
    const groups: Record<string, { name: string; items: typeof applications }> = {};
    for (const app of applications) {
      const conId = (app as any).consultancyId ?? app.instituteId ?? "unknown";
      const conName = MOCK_CONSULTANCIES.find((c) => c.id === conId)?.name ?? `Consultancy ${conId}`;
      if (!groups[conId]) groups[conId] = { name: conName, items: [] };
      groups[conId].items.push(app);
    }
    return groups;
  }, [isPlatformOwner, applications, entityFilter]);

  const handleCreate = async (values: z.infer<typeof visaSchema>) => {
    try {
      await createMutation.mutateAsync({
        studentName: values.studentName!,
        country: values.country!,
        visaType: values.visaType!,
        notes: values.notes ?? "",
        studentId: `S${Date.now()}`,
        status: "pending",
        appliedDate: new Date().toISOString().split("T")[0],
        documents: [],
        counselorId: "C1",
        counselorName: "Dr. Anita Sharma",
        instituteId: currentInstitute.id,
      });
      toast.success("Visa application created");
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
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold font-display">{app.studentName}</h3>
            <p className="text-xs text-muted-foreground">{app.country}</p>
          </div>
        </div>
        <StatusBadge variant={statusColors[app.status] as any}>{app.status.replace("_", " ")}</StatusBadge>
      </div>
      <div className="space-y-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5"><FileText className="w-3 h-3" /> {app.visaType}</div>
        <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Applied: {app.appliedDate}</div>
        {app.interviewDate && <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Interview: {app.interviewDate}</div>}
        <div className="flex items-center gap-1.5"><User className="w-3 h-3" /> Counselor: {app.counselorName}</div>
      </div>
      <div className="flex flex-wrap gap-1">
        {app.documents.map((doc: string) => (
          <span key={doc} className="px-2 py-0.5 rounded-md bg-secondary text-xs">{doc}</span>
        ))}
      </div>
      {app.notes && <p className="text-xs text-muted-foreground border-t border-border pt-2">{app.notes}</p>}
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Visa Tracking"
        description={isPlatformOwner ? "View visa applications across all consultancies" : "Track and manage student visa applications"}
        actions={!isViewOnly ? (
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="w-4 h-4 mr-1" /> New Application</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-display">New Visa Application</DialogTitle></DialogHeader>
              <ReusableForm schema={visaSchema} defaultValues={{ studentName: "", country: "", visaType: "", notes: "" }} onSubmit={handleCreate} submitLabel="Create" isLoading={createMutation.isPending}>
                {(form) => (
                  <>
                    <FormInput form={form} name="studentName" label="Student Name" placeholder="Full name" />
                    <FormSelect form={form} name="country" label="Country" options={[
                      { label: "United Kingdom", value: "United Kingdom" }, { label: "United States", value: "United States" },
                      { label: "Canada", value: "Canada" }, { label: "Australia", value: "Australia" },
                      { label: "Germany", value: "Germany" }, { label: "France", value: "France" },
                      { label: "Japan", value: "Japan" }, { label: "New Zealand", value: "New Zealand" },
                    ]} />
                    <FormInput form={form} name="visaType" label="Visa Type" placeholder="e.g., Tier 4 Student" />
                    <FormTextarea form={form} name="notes" label="Notes" placeholder="Additional notes..." />
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
            <div className="text-center py-12 text-muted-foreground text-sm">No visa applications found</div>
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
