// ============= Browse Consultancies (Internal - Platform Owner) =============
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Star, Globe, Users, UserCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchManagedConsultancies } from "@/services/managedConsultancies";
import type { ManagedConsultancy } from "@/services/managedConsultancies";

export default function BrowseConsultanciesInternal() {
  const [consultancies, setConsultancies] = useState<ManagedConsultancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchManagedConsultancies({ search }).then((res) => {
      setConsultancies(res.data);
      setLoading(false);
    });
  }, [search]);

  return (
    <div className="space-y-6">
      <PageHeader title="Browse Consultancies" description="Explore consultancies registered on the platform" />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search consultancies..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {consultancies.map((con) => (
            <motion.div key={con.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5 hover:shadow-elevated transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold">{con.logo}</div>
                  <div>
                    <h3 className="text-sm font-semibold font-display">{con.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{con.city}</p>
                  </div>
                </div>
                <StatusBadge variant={con.status === "active" ? "success" : con.status === "suspended" ? "destructive" : "warning"}>{con.status}</StatusBadge>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-secondary/50 rounded-lg p-2 text-center">
                  <p className="text-sm font-bold font-display">{con.studentCount}</p>
                  <p className="text-[10px] text-muted-foreground">Students</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-2 text-center">
                  <p className="text-sm font-bold font-display">{con.counselorCount}</p>
                  <p className="text-[10px] text-muted-foreground">Counselors</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-2 text-center">
                  <p className="text-sm font-bold font-display text-success">{con.visaSuccessRate > 0 ? `${con.visaSuccessRate}%` : "—"}</p>
                  <p className="text-[10px] text-muted-foreground">Success</p>
                </div>
              </div>
              {con.countries.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {con.countries.map((c) => (
                    <span key={c} className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-xs text-primary"><Globe className="w-3 h-3" />{c}</span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {!loading && consultancies.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">No consultancies found</div>
      )}
    </div>
  );
}
