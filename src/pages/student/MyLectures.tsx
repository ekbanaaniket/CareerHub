// ============= Student: My Lectures (Grouped by Institute) =============
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Input } from "@/components/ui/input";
import { EntityGroupCard, EntityGroupSkeleton, LazyItemList, type EntityGroupInfo } from "@/components/common/EntityGroupCard";
import { useStudentLectures, useStudentInstitutes } from "@/hooks/useStudentData";
import { Search, Play, Calendar, Users, Video } from "lucide-react";
import { useState, useMemo } from "react";
import type { StudentLecture } from "@/services/studentData";

function LectureCard({ lec }: { lec: StudentLecture }) {
  return (
    <div className="bg-secondary/30 rounded-lg border border-border overflow-hidden hover:bg-secondary/50 transition-all group">
      <div className="relative h-28 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
          {lec.status === "recorded" ? <Play className="w-4 h-4 text-primary ml-0.5" /> : <Calendar className="w-4 h-4 text-primary" />}
        </div>
        <div className="absolute top-2 right-2">
          <StatusBadge variant={lec.status === "recorded" ? "success" : lec.status === "upcoming" ? "warning" : "info"}>{lec.status}</StatusBadge>
        </div>
        {lec.duration !== "—" && <div className="absolute bottom-2 right-2 bg-foreground/80 text-background text-xs px-2 py-0.5 rounded">{lec.duration}</div>}
      </div>
      <div className="p-3">
        <p className="text-xs text-muted-foreground mb-0.5">{lec.module}</p>
        <h3 className="text-sm font-semibold font-display mb-1.5 line-clamp-2">{lec.title}</h3>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{lec.instructor}</span>
          <span className="flex items-center gap-1">{lec.status === "recorded" ? <><Users className="w-3 h-3" /> {lec.views}</> : lec.date}</span>
        </div>
      </div>
    </div>
  );
}

export default function MyLectures() {
  const { data: lectures, grouped, isLoading } = useStudentLectures();
  const { data: institutes } = useStudentInstitutes();
  const [search, setSearch] = useState("");

  const filteredGrouped = useMemo(() => {
    if (!grouped) return {};
    if (!search) return grouped;
    const q = search.toLowerCase();
    const result: typeof grouped = {};
    for (const [id, group] of Object.entries(grouped)) {
      const filtered = group.lectures.filter(l => l.title.toLowerCase().includes(q) || l.instructor.toLowerCase().includes(q));
      if (filtered.length > 0) result[id] = { ...group, lectures: filtered };
    }
    return result;
  }, [grouped, search]);

  if (isLoading || !lectures) return <EntityGroupSkeleton count={2} />;

  return (
    <div className="space-y-6">
      <PageHeader title="My Lectures" description="Lectures from your enrolled courses, grouped by institute" />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search lectures..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="space-y-4">
        {Object.entries(filteredGrouped).map(([instId, group]) => {
          const inst = institutes?.find(i => i.id === instId);
          const entity: EntityGroupInfo = {
            id: instId, name: group.instituteName, type: "institute",
            logo: inst?.logo ?? "IN", subtitle: inst?.location,
            meta: [{ label: "Lectures", value: group.lectures.length }],
          };
          return (
            <EntityGroupCard key={instId} entity={entity}>
              <LazyItemList
                items={group.lectures}
                initialCount={4}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
                renderItem={(lec) => <LectureCard key={lec.id} lec={lec} />}
              />
            </EntityGroupCard>
          );
        })}
      </div>
    </div>
  );
}
