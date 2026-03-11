// ============= Student: My Visa Status (Grouped by Consultancy) =============
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EntityGroupCard, EntityGroupSkeleton, LazyItemList, type EntityGroupInfo } from "@/components/common/EntityGroupCard";
import { useStudentConsultancies } from "@/hooks/useStudentData";
import { Plane } from "lucide-react";

const VISA_VARIANT: Record<string, "success" | "warning" | "info" | "outline" | "destructive"> = {
  "Approved": "success", "In Review": "warning", "Documents Pending": "outline", "Documents Submitted": "info", "Rejected": "destructive",
};

export default function MyVisaStatus() {
  const { data: consultancies, isLoading } = useStudentConsultancies();

  if (isLoading || !consultancies) return <EntityGroupSkeleton count={2} />;

  const grouped = consultancies
    .map(c => ({
      ...c,
      visaServices: c.services.filter(s => s.type === "visa"),
    }))
    .filter(c => c.visaServices.length > 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Visa Status" description="Track your visa applications grouped by consultancy" />

      <div className="space-y-4">
        {grouped.map((con) => {
          const entity: EntityGroupInfo = {
            id: con.id, name: con.name, type: "consultancy", logo: con.logo,
            subtitle: con.location,
            meta: [{ label: "Visa Apps", value: con.visaServices.length }],
          };
          return (
            <EntityGroupCard key={con.id} entity={entity}>
              <LazyItemList
                items={con.visaServices}
                initialCount={3}
                renderItem={(svc) => (
                  <div key={svc.id} className="p-4 rounded-lg bg-secondary/30 border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Plane className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold font-display">{svc.label}</h3>
                          <p className="text-xs text-muted-foreground">Counselor: {svc.counselor}</p>
                        </div>
                      </div>
                      <StatusBadge variant={VISA_VARIANT[svc.status] ?? "info"}>{svc.status}</StatusBadge>
                    </div>
                    {svc.details && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                        {Object.entries(svc.details).map(([k, v]) => (
                          <div key={k} className="p-2 rounded bg-background border border-border">
                            <span className="text-muted-foreground capitalize block">{k.replace(/([A-Z])/g, " $1")}</span>
                            <span className="font-medium">{v}</span>
                          </div>
                        ))}
                      </div>
                    )}
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
