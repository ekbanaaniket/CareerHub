import { useState } from "react";
import { usePublicVacancies } from "@/hooks/usePublicVacancies";
import PublicHeader from "@/components/layout/PublicHeader";
import { FeaturedCarousel } from "@/components/common/FeaturedCarousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Search, MapPin, Briefcase, Clock, Users, DollarSign, Calendar, Award } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function BrowseJobs() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [applyOpen, setApplyOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [appForm, setAppForm] = useState({ name: "", email: "", resume: "" });

  const { data: vacancies = [], isLoading } = usePublicVacancies({
    search,
    type: typeFilter !== "all" ? typeFilter : undefined,
    locationType: locationFilter !== "all" ? locationFilter : undefined,
  });

  const activeVacancies = vacancies.filter((v) => v.status === "active");
  const featuredJobs = activeVacancies.filter((v) => v.isFeatured);
  const regularJobs = activeVacancies.filter((v) => !v.isFeatured);

  const handleApply = () => {
    toast.success(`Application submitted for ${selectedJob?.title} at ${selectedJob?.companyName}!`);
    setApplyOpen(false);
    setAppForm({ name: "", email: "", resume: "" });
  };

  const renderJobCard = (vac: typeof activeVacancies[0], _i: number, isFeatured = false) => (
    <div key={vac.id} className={`bg-card rounded-xl border shadow-card p-5 hover:shadow-elevated transition-shadow relative ${
      isFeatured ? "border-primary/40 ring-1 ring-primary/20" : "border-border"
    }`}>
      {isFeatured && (
        <div className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center gap-1">
          <Award className="w-3 h-3" /> Featured
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-sm shrink-0">
            {vac.companyName.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold font-display mb-0.5">{vac.title}</h3>
            <p className="text-xs text-muted-foreground mb-2">{vac.companyName}</p>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{vac.description}</p>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{vac.location}</span>
              <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{vac.salary}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{vac.experience}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Deadline: {vac.deadline}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {vac.skills.map((s) => (
                <span key={s} className="px-2 py-0.5 rounded-md bg-secondary text-xs text-muted-foreground">{s}</span>
              ))}
              <StatusBadge variant={vac.locationType === "remote" ? "success" : vac.locationType === "hybrid" ? "info" : "default"}>
                {vac.locationType}
              </StatusBadge>
              <StatusBadge variant="default">{vac.type}</StatusBadge>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <p className="text-xs text-muted-foreground">{vac.positions} positions • {vac.applicants} applicants</p>
          <Button size="sm" onClick={() => { setSelectedJob(vac); setApplyOpen(true); }}>
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl">Job Board</h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Browse open positions from top companies. Apply directly and track your applications.
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by title, company, or skill..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
            </SelectContent>
          </Select>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="onsite">On-site</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Jobs", value: activeVacancies.length.toString(), icon: Briefcase, color: "text-primary" },
            { label: "Companies", value: new Set(activeVacancies.map((v) => v.companyId)).size.toString(), icon: Users, color: "text-success" },
            { label: "Remote Jobs", value: activeVacancies.filter((v) => v.locationType === "remote").length.toString(), icon: MapPin, color: "text-warning" },
            { label: "Internships", value: activeVacancies.filter((v) => v.type === "internship").length.toString(), icon: Clock, color: "text-info" },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-xl border border-border p-4 text-center">
              <s.icon className={`w-5 h-5 mx-auto mb-2 ${s.color}`} />
              <p className="font-display font-bold text-xl">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground text-sm">Loading vacancies...</div>
        ) : (
          <>
            {/* Featured Carousel */}
            {featuredJobs.length > 0 && (
              <FeaturedCarousel
                items={featuredJobs}
                title="Featured Jobs"
                visibleCount={1}
                autoplayInterval={4000}
                renderCard={(vac, i) => renderJobCard(vac, i, true)}
              />
            )}

            {/* Regular Jobs */}
            {regularJobs.length > 0 && (
              <div className="space-y-3">
                {featuredJobs.length > 0 && (
                  <h2 className="font-display font-semibold text-base text-muted-foreground">All Jobs</h2>
                )}
                {regularJobs.map((vac, i) => renderJobCard(vac, i))}
              </div>
            )}
          </>
        )}

        {!isLoading && activeVacancies.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">No active vacancies found</div>
        )}
      </div>

      {/* Apply Dialog */}
      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Apply for {selectedJob?.title}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-sm font-medium">{selectedJob?.companyName}</p>
              <p className="text-xs text-muted-foreground">{selectedJob?.location} • {selectedJob?.salary}</p>
            </div>
            <div><Label>Full Name</Label><Input placeholder="Your name" className="mt-1" value={appForm.name} onChange={(e) => setAppForm({ ...appForm, name: e.target.value })} /></div>
            <div><Label>Email</Label><Input type="email" placeholder="you@email.com" className="mt-1" value={appForm.email} onChange={(e) => setAppForm({ ...appForm, email: e.target.value })} /></div>
            <div><Label>Resume URL / LinkedIn</Label><Input placeholder="https://linkedin.com/in/..." className="mt-1" value={appForm.resume} onChange={(e) => setAppForm({ ...appForm, resume: e.target.value })} /></div>
            <Button className="w-full" onClick={handleApply} disabled={!appForm.name || !appForm.email}>
              Submit Application
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
