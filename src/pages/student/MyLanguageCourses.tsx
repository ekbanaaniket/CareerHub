// ============= Student: My Language Courses (Grouped by Consultancy) =============
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { EntityGroupCard, EntityGroupSkeleton, LazyItemList, type EntityGroupInfo } from "@/components/common/EntityGroupCard";
import { useStudentConsultancies } from "@/hooks/useStudentData";
import { Languages, Clock } from "lucide-react";

export default function MyLanguageCourses() {
  const { data: consultancies, isLoading } = useStudentConsultancies();

  if (isLoading || !consultancies) return <EntityGroupSkeleton count={2} />;

  const grouped = consultancies
    .map(c => ({ ...c, langServices: c.services.filter(s => s.type === "language") }))
    .filter(c => c.langServices.length > 0);

  return (
    <div className="space-y-6">
      <PageHeader title="My Language Courses" description="Language preparation courses grouped by consultancy" />

      <div className="space-y-4">
        {grouped.map((con) => {
          const entity: EntityGroupInfo = {
            id: con.id, name: con.name, type: "consultancy", logo: con.logo,
            subtitle: con.location,
            meta: [{ label: "Courses", value: con.langServices.length }],
          };
          return (
            <EntityGroupCard key={con.id} entity={entity}>
              <LazyItemList
                items={con.langServices}
                initialCount={3}
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
                renderItem={(svc) => (
                  <div key={svc.id} className="p-4 rounded-lg bg-secondary/30 border border-border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                        <Languages className="w-5 h-5 text-warning" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold font-display">{svc.label}</h3>
                        <p className="text-xs text-muted-foreground">Counselor: {svc.counselor}</p>
                      </div>
                      <StatusBadge variant="info">{svc.status}</StatusBadge>
                    </div>
                    {svc.details && (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {svc.details.targetScore && (
                            <div className="p-2 rounded bg-background border border-border">
                              <span className="text-muted-foreground">Target</span>
                              <p className="font-medium">{svc.details.targetScore}</p>
                            </div>
                          )}
                          {svc.details.currentScore && (
                            <div className="p-2 rounded bg-background border border-border">
                              <span className="text-muted-foreground">Current</span>
                              <p className="font-medium">{svc.details.currentScore}</p>
                            </div>
                          )}
                        </div>
                        {svc.details.nextClass && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" /> Next class: {svc.details.nextClass}
                          </div>
                        )}
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
