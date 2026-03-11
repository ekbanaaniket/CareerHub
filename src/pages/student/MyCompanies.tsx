// ============= Student: My Companies / Applied Jobs (Grouped) =============
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatCard } from "@/components/common/StatCard";
import { EntityGroupCard, EntityGroupSkeleton, LazyItemList, type EntityGroupInfo } from "@/components/common/EntityGroupCard";
import { useStudentCompanyGroups } from "@/hooks/useStudentData";
import { Briefcase, MapPin, Clock, Building2, CheckCircle, Users, AlertCircle, Calendar, Award } from "lucide-react";
import type { StudentJobApplication } from "@/services/studentData";

const STATUS_CONFIG: Record<string, { label: string; variant: "info" | "warning" | "success" | "destructive" | "outline" }> = {
  applied: { label: "Applied", variant: "info" },
  under_review: { label: "Under Review", variant: "warning" },
  interview_scheduled: { label: "Interview Scheduled", variant: "success" },
  selected: { label: "Selected", variant: "success" },
  rejected: { label: "Rejected", variant: "destructive" },
  offer_received: { label: "Offer Received", variant: "success" },
};

function ApplicationCard({ app }: { app: StudentJobApplication }) {
  const cfg = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.applied;
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border hover:bg-secondary/50 transition-colors">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Briefcase className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold font-display truncate">{app.vacancyTitle}</p>
          <StatusBadge variant="outline" className="text-[10px]">{app.type}</StatusBadge>
        </div>
        <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{app.location}</span>
          <span>{app.salary}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Applied {app.appliedDate}</span>
        </div>
        {app.interviewDate && (
          <p className="text-xs text-success mt-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Interview: {app.interviewDate}
          </p>
        )}
        {app.offerSalary && (
          <p className="text-xs text-success mt-1 flex items-center gap-1">
            <Award className="w-3 h-3" /> Offer: {app.offerSalary}
          </p>
        )}
      </div>
      <StatusBadge variant={cfg.variant}>{cfg.label}</StatusBadge>
    </div>
  );
}

export default function MyCompanies() {
  const { data: groups, isLoading } = useStudentCompanyGroups();

  if (isLoading || !groups) return <EntityGroupSkeleton count={3} />;

  const allApps = groups.flatMap(g => g.applications);
  const stats = {
    total: allApps.length,
    underReview: allApps.filter(a => a.status === "under_review").length,
    interviews: allApps.filter(a => a.status === "interview_scheduled").length,
    selected: allApps.filter(a => a.status === "selected").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader title="My Job Applications" description="Track your applied jobs grouped by company" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard title="Total Applied" value={String(stats.total)} change={`${groups.length} companies`} changeType="neutral" icon={<Briefcase className="w-5 h-5" />} />
        <StatCard title="Under Review" value={String(stats.underReview)} change="In progress" changeType="neutral" icon={<Users className="w-5 h-5" />} />
        <StatCard title="Interviews" value={String(stats.interviews)} change="Scheduled" changeType="positive" icon={<Calendar className="w-5 h-5" />} />
        <StatCard title="Selected" value={String(stats.selected)} change="Congratulations!" changeType="positive" icon={<CheckCircle className="w-5 h-5" />} />
      </div>

      <div className="space-y-4">
        {groups.map((group) => {
          const entity: EntityGroupInfo = {
            id: group.companyId,
            name: group.companyName,
            type: "company",
            logo: group.companyLogo,
            subtitle: `${group.industry} · ${group.city}`,
            meta: [
              { label: "Applications", value: group.applications.length },
            ],
          };

          return (
            <EntityGroupCard key={group.companyId} entity={entity}>
              <LazyItemList
                items={group.applications}
                initialCount={3}
                renderItem={(app) => <ApplicationCard key={app.id} app={app} />}
              />
            </EntityGroupCard>
          );
        })}
      </div>
    </div>
  );
}
