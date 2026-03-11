// ============= Student: My Placements (Grouped by Institute) =============
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EntityGroupCard, EntityGroupSkeleton, LazyItemList, type EntityGroupInfo } from "@/components/common/EntityGroupCard";
import { useStudentPlacements, useStudentInstitutes } from "@/hooks/useStudentData";
import { Building2, MapPin } from "lucide-react";
import type { StudentPlacement } from "@/services/studentData";

const STATUS_VARIANT: Record<string, "success" | "warning" | "info" | "destructive"> = {
  selected: "success", interview: "success", shortlisted: "warning", applied: "info", rejected: "destructive",
};

function PlacementCard({ p }: { p: StudentPlacement }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Building2 className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">{p.role} at {p.company}</p>
        <p className="text-xs text-muted-foreground flex items-center gap-2">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.location}</span> · {p.salary} · {p.date}
        </p>
      </div>
      <StatusBadge variant={STATUS_VARIANT[p.status] ?? "info"}>{p.status}</StatusBadge>
    </div>
  );
}

export default function MyPlacements() {
  const { data: placements, grouped, isLoading } = useStudentPlacements();
  const { data: institutes } = useStudentInstitutes();

  if (isLoading || !placements) return <EntityGroupSkeleton count={2} />;

  return (
    <div className="space-y-6">
      <PageHeader title="Placement Opportunities" description="Campus placements grouped by institute" />

      <div className="space-y-4">
        {Object.entries(grouped).map(([instId, group]) => {
          const inst = institutes?.find(i => i.id === instId);
          const entity: EntityGroupInfo = {
            id: instId, name: group.instituteName, type: "institute",
            logo: inst?.logo ?? "IN", subtitle: inst?.location,
            meta: [{ label: "Placements", value: group.placements.length }],
          };
          return (
            <EntityGroupCard key={instId} entity={entity}>
              <LazyItemList
                items={group.placements}
                initialCount={4}
                renderItem={(p) => <PlacementCard key={p.id} p={p} />}
              />
            </EntityGroupCard>
          );
        })}
      </div>
    </div>
  );
}
