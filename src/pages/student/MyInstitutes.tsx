// ============= Student: My Registered Institutes =============
import { PageHeader } from "@/components/common/PageHeader";
import { EntityGroupCard, EntityGroupSkeleton, type EntityGroupInfo } from "@/components/common/EntityGroupCard";
import { Progress } from "@/components/ui/progress";
import { useStudentInstitutes } from "@/hooks/useStudentData";
import { ChevronRight, GraduationCap, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function MyInstitutes() {
  const { data: institutes, isLoading } = useStudentInstitutes();

  if (isLoading || !institutes) return <EntityGroupSkeleton count={3} />;

  return (
    <div className="space-y-6">
      <PageHeader title="My Institutes" description="Institutes you are registered with" />

      <div className="space-y-4">
        {institutes.map((inst) => {
          const entity: EntityGroupInfo = {
            id: inst.id,
            name: inst.name,
            type: "institute",
            logo: inst.logo,
            subtitle: inst.location,
            status: inst.status,
            meta: [
              { label: "Courses", value: inst.courses },
              { label: "Progress", value: `${inst.progress}%` },
            ],
          };

          return (
            <EntityGroupCard key={inst.id} entity={entity}>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{inst.location}</span>
                  <span>·</span>
                  <span>Joined {inst.joinDate}</span>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Overall Progress</span>
                    <span className="font-medium">{inst.progress}%</span>
                  </div>
                  <Progress value={inst.progress} className="h-2" />
                </div>
                <Link
                  to={`/my/institutes/courses?institute=${inst.id}`}
                  className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  View Courses <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </EntityGroupCard>
          );
        })}
      </div>
    </div>
  );
}
