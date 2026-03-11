import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EntityGroupFilter, MOCK_CONSULTANCIES } from "@/components/common/EntityGroupFilter";
import { CollapsibleEntityGroup, ShowMoreList } from "@/components/common/CollapsibleEntityGroup";
import { Button } from "@/components/ui/button";
import { Plus, User, Mail, Phone, Star, Globe, Users } from "lucide-react";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCounselors, useCreateCounselor } from "@/hooks/useConsultancy";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { z } from "zod";
import { ReusableForm, FormInput } from "@/components/forms";
import { useCanManage } from "@/hooks/useCanManage";

const counselorSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  specialization: z.string().min(1),
});

export default function CounselorsPage() {
  const { currentInstitute } = useApp();
  const { user } = useAuth();
  const isPlatformOwner = user?.role === "platform_owner";
  const { isViewOnly } = useCanManage();
  const [createOpen, setCreateOpen] = useState(false);
  const [entityFilter, setEntityFilter] = useState("all");

  const instituteIdParam = isPlatformOwner
    ? (entityFilter !== "all" ? entityFilter : undefined)
    : currentInstitute.id;

  const { data: counselors, isLoading } = useCounselors(instituteIdParam);
  const createMutation = useCreateCounselor();

  const groupedCounselors = useMemo(() => {
    if (!isPlatformOwner || !counselors || entityFilter !== "all") return null;
    const groups: Record<string, { name: string; items: typeof counselors }> = {};
    for (const c of counselors) {
      const conId = (c as any).consultancyId ?? c.instituteId ?? "unknown";
      const conName = MOCK_CONSULTANCIES.find((con) => con.id === conId)?.name ?? `Consultancy ${conId}`;
      if (!groups[conId]) groups[conId] = { name: conName, items: [] };
      groups[conId].items.push(c);
    }
    return groups;
  }, [isPlatformOwner, counselors, entityFilter]);

  const handleCreate = async (values: z.infer<typeof counselorSchema>) => {
    try {
      await createMutation.mutateAsync({
        name: values.name!,
        email: values.email!,
        phone: values.phone!,
        specialization: values.specialization!.split(",").map((s) => s.trim()),
        countries: [],
        activeStudents: 0,
        totalPlacements: 0,
        rating: 0,
        status: "active",
        instituteId: currentInstitute.id,
      });
      toast.success("Counselor added");
      setCreateOpen(false);
    } catch {
      toast.error("Failed to add");
    }
  };

  const renderCard = (c: any) => (
    <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border border-border shadow-card p-5"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold shrink-0">
          {c.name.split(" ").map((n: string) => n[0]).join("")}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold font-display">{c.name}</h3>
            <StatusBadge variant={c.status === "active" ? "success" : "warning"}>{c.status}</StatusBadge>
          </div>
          <div className="space-y-1 mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {c.email}</div>
            <div className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {c.phone}</div>
            <div className="flex items-center gap-1.5"><Users className="w-3 h-3" /> {c.activeStudents} active students • {c.totalPlacements} total placements</div>
            <div className="flex items-center gap-1.5">
              <Star className="w-3 h-3 text-warning fill-warning" /> {c.rating}/5.0
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mt-3">
            {c.specialization.map((s: string) => (
              <span key={s} className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs">{s}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {c.countries.map((country: string) => (
              <span key={country} className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary text-xs">
                <Globe className="w-2.5 h-2.5" /> {country}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Counselors"
        description={isPlatformOwner ? "View counselors across all consultancies" : "Manage counselors and their student assignments"}
        actions={!isViewOnly ? (
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add Counselor</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-display">Add Counselor</DialogTitle></DialogHeader>
              <ReusableForm schema={counselorSchema} defaultValues={{ name: "", email: "", phone: "", specialization: "" }} onSubmit={handleCreate} submitLabel="Add" isLoading={createMutation.isPending}>
                {(form) => (
                  <>
                    <FormInput form={form} name="name" label="Name" />
                    <FormInput form={form} name="email" label="Email" />
                    <FormInput form={form} name="phone" label="Phone" />
                    <FormInput form={form} name="specialization" label="Specializations" placeholder="UK, USA, Canada (comma separated)" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
        </div>
      ) : isPlatformOwner && groupedCounselors ? (
        <div className="space-y-6">
          {Object.entries(groupedCounselors).map(([conId, group]) => (
            <CollapsibleEntityGroup key={conId} entityName={group.name} entityType="consultancy" count={group.items.length}>
              <ShowMoreList
                items={group.items}
                initialCount={4}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                renderItem={renderCard}
              />
            </CollapsibleEntityGroup>
          ))}
          {Object.keys(groupedCounselors).length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">No counselors found</div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {counselors?.map(renderCard)}
        </div>
      )}
    </div>
  );
}
