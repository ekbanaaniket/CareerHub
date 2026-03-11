// ============= Student: My Consultancies (Grouped) =============
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EntityGroupCard, EntityGroupSkeleton, LazyItemList, type EntityGroupInfo } from "@/components/common/EntityGroupCard";
import { useStudentConsultancies } from "@/hooks/useStudentData";
import { Plane, University, Languages, Globe, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { StudentConsultancyService } from "@/services/studentData";

const iconMap = { visa: Plane, university: University, language: Languages };
const linkMap = { visa: "/my/consultancies/visa", university: "/my/consultancies/university", language: "/my/consultancies/language" };

const STATUS_VARIANT: Record<string, "success" | "info" | "warning" | "destructive" | "outline"> = {
  "Approved": "success",
  "In Review": "warning",
  "In Progress": "info",
  "Documents Submitted": "info",
  "Under Review": "warning",
  "Documents Pending": "outline",
  "Preparing": "outline",
};

function ServiceCard({ svc }: { svc: StudentConsultancyService }) {
  const Icon = iconMap[svc.type] || Globe;
  return (
    <div className="p-3 rounded-lg bg-secondary/30 border border-border hover:bg-secondary/50 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{svc.type}</span>
        <StatusBadge variant={STATUS_VARIANT[svc.status] ?? "info"} className="ml-auto">{svc.status}</StatusBadge>
      </div>
      <p className="text-sm font-medium">{svc.label}</p>
      <p className="text-xs text-muted-foreground mt-1">Counselor: {svc.counselor}</p>
      {svc.details && (
        <div className="mt-2 space-y-0.5">
          {Object.entries(svc.details).map(([k, v]) => (
            <div key={k} className="flex justify-between text-[11px]">
              <span className="text-muted-foreground capitalize">{k.replace(/([A-Z])/g, " $1")}</span>
              <span className="font-medium">{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MyConsultancies() {
  const { data: consultancies, isLoading } = useStudentConsultancies();

  if (isLoading || !consultancies) return <EntityGroupSkeleton count={2} />;

  return (
    <div className="space-y-6">
      <PageHeader title="My Consultancies" description="Consultancies you are registered with and active services" />

      <div className="space-y-4">
        {consultancies.map((con) => {
          const entity: EntityGroupInfo = {
            id: con.id,
            name: con.name,
            type: "consultancy",
            logo: con.logo,
            subtitle: `${con.location} · Joined ${con.joinDate}`,
            status: con.status,
            meta: [
              { label: "Services", value: con.services.length },
              { label: "Active", value: con.services.filter(s => s.status !== "Approved" && s.status !== "Completed").length },
            ],
          };

          return (
            <EntityGroupCard key={con.id} entity={entity}>
              <LazyItemList
                items={con.services}
                initialCount={3}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                renderItem={(svc) => <ServiceCard key={svc.id} svc={svc} />}
              />
              <div className="flex gap-2 mt-3">
                {(["visa", "university", "language"] as const).map((type) => {
                  const Icon = iconMap[type];
                  const count = con.services.filter(s => s.type === type).length;
                  if (count === 0) return null;
                  return (
                    <Link
                      key={type}
                      to={linkMap[type]}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {type.charAt(0).toUpperCase() + type.slice(1)} ({count})
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  );
                })}
              </div>
            </EntityGroupCard>
          );
        })}
      </div>
    </div>
  );
}
