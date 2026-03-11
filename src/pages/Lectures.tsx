import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Video, Search, Play, Clock, Users, Plus, Calendar } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useCanManage } from "@/hooks/useCanManage";

const lectures = [
  { id: 1, title: "Introduction to HTML & CSS", instructor: "John Doe", duration: "2h 15m", date: "Jan 15, 2026", views: 245, status: "recorded", module: "Week 1" },
  { id: 2, title: "JavaScript Fundamentals", instructor: "John Doe", duration: "2h 30m", date: "Jan 16, 2026", views: 230, status: "recorded", module: "Week 1" },
  { id: 3, title: "DOM Manipulation Deep Dive", instructor: "Jane Smith", duration: "1h 45m", date: "Jan 20, 2026", views: 198, status: "recorded", module: "Week 2" },
  { id: 4, title: "React Basics - Components & Props", instructor: "John Doe", duration: "2h 00m", date: "Feb 3, 2026", views: 175, status: "recorded", module: "Week 5" },
  { id: 5, title: "TypeScript for React", instructor: "Jane Smith", duration: "2h 20m", date: "Feb 10, 2026", views: 160, status: "recorded", module: "Week 6" },
  { id: 6, title: "State Management with Hooks", instructor: "John Doe", duration: "—", date: "Mar 3, 2026", views: 0, status: "upcoming", module: "Week 9" },
  { id: 7, title: "API Integration & Fetching", instructor: "Jane Smith", duration: "—", date: "Mar 5, 2026", views: 0, status: "scheduled", module: "Week 9" },
  { id: 8, title: "Git Workflow & Collaboration", instructor: "John Doe", duration: "1h 50m", date: "Jan 22, 2026", views: 210, status: "recorded", module: "Week 4" },
];

export default function Lectures() {
  const { isViewOnly } = useCanManage();
  const [search, setSearch] = useState("");

  const filtered = lectures.filter(l => l.title.toLowerCase().includes(search.toLowerCase()) || l.instructor.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lectures"
        description="Recorded and upcoming lecture sessions"
        actions={!isViewOnly ? <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Schedule Lecture</Button> : undefined}
      />

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search lectures..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Lectures Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((lec) => (
          <motion.div
            key={lec.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-border shadow-card overflow-hidden hover:shadow-elevated transition-all group"
          >
            {/* Thumbnail placeholder */}
            <div className="relative h-36 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                {lec.status === "recorded" ? (
                  <Play className="w-5 h-5 text-primary ml-0.5" />
                ) : (
                  <Calendar className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className="absolute top-2 right-2">
                <StatusBadge variant={lec.status === "recorded" ? "success" : lec.status === "upcoming" ? "warning" : "info"}>
                  {lec.status}
                </StatusBadge>
              </div>
              {lec.duration !== "—" && (
                <div className="absolute bottom-2 right-2 bg-foreground/80 text-background text-xs px-2 py-0.5 rounded">
                  {lec.duration}
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="text-xs text-muted-foreground mb-1">{lec.module}</p>
              <h3 className="text-sm font-semibold font-display mb-2 line-clamp-2">{lec.title}</h3>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{lec.instructor}</span>
                <span className="flex items-center gap-1">{lec.status === "recorded" ? <><Users className="w-3 h-3" /> {lec.views}</> : lec.date}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
