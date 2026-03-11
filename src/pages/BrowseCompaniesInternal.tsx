// ============= Browse Companies (Internal - Platform Owner) =============
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Briefcase, Users, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchManagedCompanies } from "@/services/managedCompanies";
import type { ManagedCompany } from "@/services/managedCompanies";

export default function BrowseCompaniesInternal() {
  const [companies, setCompanies] = useState<ManagedCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchManagedCompanies({ search }).then((res) => {
      setCompanies(res.data);
      setLoading(false);
    });
  }, [search]);

  return (
    <div className="space-y-6">
      <PageHeader title="Browse Companies" description="Explore companies registered on the platform" />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search companies..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {companies.map((comp) => (
            <motion.div key={comp.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5 hover:shadow-elevated transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold">{comp.logo}</div>
                  <div>
                    <h3 className="text-sm font-semibold font-display">{comp.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{comp.city}</p>
                  </div>
                </div>
                <StatusBadge variant={comp.status === "active" ? "success" : comp.status === "suspended" ? "destructive" : "warning"}>{comp.status}</StatusBadge>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-secondary/50 rounded-lg p-2 text-center">
                  <p className="text-sm font-bold font-display">{comp.vacancyCount}</p>
                  <p className="text-[10px] text-muted-foreground">Vacancies</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-2 text-center">
                  <p className="text-sm font-bold font-display">{comp.applicantCount.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">Applicants</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-2 text-center">
                  <p className="text-sm font-bold font-display text-success">{comp.hiredCount}</p>
                  <p className="text-[10px] text-muted-foreground">Hired</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-secondary text-xs text-muted-foreground">{comp.industry}</span>
                <StatusBadge variant={comp.plan === "premium" ? "success" : comp.plan === "basic" ? "info" : "default"}>{comp.plan}</StatusBadge>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && companies.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">No companies found</div>
      )}
    </div>
  );
}
