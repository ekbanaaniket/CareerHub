import { Link } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicInstitutes } from "@/services/publicInstitutes";
import { fetchPublicConsultancies } from "@/services/publicConsultancies";
import { fetchVacancies } from "@/services/vacancies";
import PublicHeader from "@/components/layout/PublicHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Search, Play, BookOpen, FileText, Download, Star, MapPin,
  GraduationCap, Users, TrendingUp, Globe, Briefcase, Plane
} from "lucide-react";
import { motion } from "framer-motion";

export default function ExplorePage() {
  const [search, setSearch] = useState("");

  const { data: institutes = [] } = useQuery({
    queryKey: ["exploreInstitutes"],
    queryFn: () => fetchPublicInstitutes(),
    select: (r) => r.data,
  });

  const { data: consultancies = [] } = useQuery({
    queryKey: ["exploreConsultancies"],
    queryFn: () => fetchPublicConsultancies(),
    select: (r) => r.data,
  });

  const { data: vacancies = [] } = useQuery({
    queryKey: ["exploreVacancies"],
    queryFn: () => fetchVacancies(),
    select: (r) => r.data,
  });

  const activeVacancies = vacancies.filter((v) => v.status === "active");

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl">Explore the Platform</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Browse institutes, consultancies, and job opportunities all in one place.
          </p>
        </motion.div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: GraduationCap, label: "Institutes", value: institutes.length.toString(), color: "text-primary", link: "/browse/institutes" },
            { icon: Plane, label: "Consultancies", value: consultancies.length.toString(), color: "text-warning", link: "/browse/consultancies" },
            { icon: Briefcase, label: "Active Jobs", value: activeVacancies.length.toString(), color: "text-success", link: "/browse/jobs" },
            { icon: TrendingUp, label: "Total Students", value: "10K+", color: "text-info", link: "#" },
          ].map((s) => (
            <Link key={s.label} to={s.link} className="bg-card rounded-xl border border-border p-4 text-center hover:shadow-elevated transition-shadow">
              <s.icon className={`w-5 h-5 mx-auto mb-2 ${s.color}`} />
              <p className="font-display font-bold text-xl">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </Link>
          ))}
        </div>

        {/* Featured sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/browse/institutes" className="bg-card rounded-xl border border-border p-6 hover:shadow-elevated transition-shadow group">
            <GraduationCap className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-display font-bold text-lg mb-1">Browse Institutes</h3>
            <p className="text-sm text-muted-foreground mb-3">Explore educational academies, compare courses, and register.</p>
            <span className="text-sm text-primary group-hover:underline">View all institutes →</span>
          </Link>
          <Link to="/browse/consultancies" className="bg-card rounded-xl border border-border p-6 hover:shadow-elevated transition-shadow group">
            <Plane className="w-8 h-8 text-warning mb-3" />
            <h3 className="font-display font-bold text-lg mb-1">Browse Consultancies</h3>
            <p className="text-sm text-muted-foreground mb-3">Find visa and education consultancies for your study abroad journey.</p>
            <span className="text-sm text-primary group-hover:underline">View all consultancies →</span>
          </Link>
          <Link to="/browse/jobs" className="bg-card rounded-xl border border-border p-6 hover:shadow-elevated transition-shadow group">
            <Briefcase className="w-8 h-8 text-success mb-3" />
            <h3 className="font-display font-bold text-lg mb-1">Job Board</h3>
            <p className="text-sm text-muted-foreground mb-3">Browse open positions from top companies and apply directly.</p>
            <span className="text-sm text-primary group-hover:underline">View all jobs →</span>
          </Link>
        </div>
      </div>

      <footer className="border-t border-border py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-xs">ED</div>
            <span className="font-display font-semibold text-sm">EduPlatform</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 EduPlatform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
