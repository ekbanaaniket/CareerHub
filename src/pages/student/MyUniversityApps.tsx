// ============= Student: My University Apps (Grouped by Consultancy) =============
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EntityGroupCard, EntityGroupSkeleton, LazyItemList, type EntityGroupInfo } from "@/components/common/EntityGroupCard";
import { useStudentConsultancies } from "@/hooks/useStudentData";
import { University } from "lucide-react";

const UNI_VARIANT: Record<string, "success" | "warning" | "info" | "outline" | "destructive"> = {
  "Preparing": "outline", "Documents Submitted": "info", "Under Review": "warning", "Accepted": "success", "Rejected": "destructive", "Applied": "info",
};

export default function MyUniversityApps() {
  const { data: consultancies, isLoading } = useStudentConsultancies();

  if (isLoading || !consultancies) return <EntityGroupSkeleton count={2} />;

  const grouped = consultancies
    .map(c => ({ ...c, uniServices: c.services.filter(s => s.type === "university") }))
    .filter(c => c.uniServices.length > 0);

  return (
    <div className="space-y-6">
      <PageHeader title="University Applications" description="Track your university applications grouped by consultancy" />

      <div className="space-y-4">
        {grouped.map((con) => {
          const entity: EntityGroupInfo = {
            id: con.id, name: con.name, type: "consultancy", logo: con.logo,
            subtitle: con.location,
            meta: [{ label: "Applications", value: con.uniServices.length }],
          };
          return (
            <EntityGroupCard key={con.id} entity={entity}>
              <LazyItemList
                items={con.uniServices}
                initialCount={3}
                renderItem={(svc) => (
                  <div key={svc.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 border border-border">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <University className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold font-display truncate">{svc.label}</p>
                      <p className="text-xs text-muted-foreground">Counselor: {svc.counselor}</p>
                      {svc.details && (
                        <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                          {svc.details.program && <span>{svc.details.program}</span>}
                          {svc.details.deadline && <span>Deadline: {svc.details.deadline}</span>}
                        </div>
                      )}
                    </div>
                    <StatusBadge variant={UNI_VARIANT[svc.status] ?? "info"}>{svc.status}</StatusBadge>
                  </div>
                )}
              />
            </EntityGroupCard>
          );
        })}
      </div>
    </div>
  );
}
