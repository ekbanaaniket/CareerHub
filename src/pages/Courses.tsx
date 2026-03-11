import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Users, BookOpen, Plus, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useCanManage } from "@/hooks/useCanManage";
import { useAuth } from "@/contexts/AuthContext";
import { EntityGroupFilter, MOCK_INSTITUTES } from "@/components/common/EntityGroupFilter";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCourses } from "@/services/courses";
import type { Course } from "@/types";

export default function Courses() {
  const { isViewOnly } = useCanManage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isPlatformOwner = user?.role === "platform_owner";
  const [instituteFilter, setInstituteFilter] = useState("all");

  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: () => fetchCourses(),
    select: (res) => res.data,
  });

  const filtered = courses.filter(c => instituteFilter === "all" || c.instituteId === instituteFilter);
  const grouped = isPlatformOwner && instituteFilter === "all"
    ? MOCK_INSTITUTES.map(inst => ({ ...inst, courses: filtered.filter(c => c.instituteId === inst.id) })).filter(g => g.courses.length > 0)
    : [];

  const renderCourses = (list: Course[]) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {list.map((c) => (
        <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5 hover:shadow-elevated transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center"><GraduationCap className="w-5 h-5 text-primary-foreground" /></div>
              <div><h3 className="text-sm font-semibold font-display">{c.name}</h3><p className="text-xs text-muted-foreground">{c.startDate} — {c.endDate}</p></div>
            </div>
            <StatusBadge variant={c.status === "active" ? "success" : c.status === "upcoming" ? "info" : "default"}>{c.status}</StatusBadge>
          </div>
          <p className="text-xs text-muted-foreground mb-4">{c.description}</p>
          <div className="mb-3"><div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Progress</span><span className="font-medium">{c.completedModules}/{c.modules} modules</span></div><Progress value={(c.completedModules / c.modules) * 100} className="h-2" /></div>
          <div className="flex flex-wrap gap-1.5 mb-4">{c.topics.map(t => (<span key={t} className="px-2 py-0.5 rounded-md bg-secondary text-xs text-muted-foreground">{t}</span>))}</div>
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {c.students} students</span><span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {c.modules} modules</span></div>
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate(`/courses/${c.id}`)}>View <ChevronRight className="w-3.5 h-3.5 ml-1" /></Button>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses"
        description={isPlatformOwner ? "View courses across all institutes" : "Manage course curriculum and enrollment"}
        actions={
          <div className="flex gap-2">
            {isPlatformOwner && <EntityGroupFilter label="Institutes" entities={MOCK_INSTITUTES} selected={instituteFilter} onSelect={setInstituteFilter} />}
            {!isViewOnly && <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Create Course</Button>}
          </div>
        }
      />

      {isPlatformOwner && instituteFilter === "all" ? (
        <div className="space-y-6">
          {grouped.map(group => (
            <div key={group.id}>
              <h3 className="text-sm font-semibold font-display mb-3 flex items-center gap-2 text-primary">
                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center"><span className="text-xs font-bold">{group.name[0]}</span></div>
                {group.name} <span className="text-muted-foreground font-normal">({group.courses.length})</span>
              </h3>
              {renderCourses(group.courses)}
            </div>
          ))}
        </div>
      ) : (
        renderCourses(filtered)
      )}
    </div>
  );
}
