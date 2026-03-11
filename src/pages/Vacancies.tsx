// ============= Vacancies / Job Board Page =============
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ActionMenu } from "@/components/common/ActionMenu";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { Megaphone, Search, MapPin, Clock, Users, Briefcase, Plus, Edit, Trash2, ExternalLink, Building2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import type { Vacancy } from "@/services/vacancies";

const initialVacancies: Vacancy[] = [
  { id: "V001", companyId: "C001", companyName: "Google", title: "Frontend Engineer", description: "Build next-gen web apps with React and TypeScript.", positions: 5, location: "Mountain View, CA", locationType: "hybrid", salary: "$130K-$180K", skills: ["React", "TypeScript", "CSS", "GraphQL"], deadline: "2026-04-15", status: "active", applicants: 42, postedDate: "2026-02-20", experience: "0-2 years", type: "full-time" },
  { id: "V002", companyId: "C002", companyName: "Microsoft", title: "Full-Stack Developer", description: "Work on Azure cloud services.", positions: 3, location: "Seattle, WA", locationType: "onsite", salary: "$125K-$165K", skills: ["Node.js", "React", "Azure", "SQL"], deadline: "2026-04-10", status: "active", applicants: 38, postedDate: "2026-02-18", experience: "1-3 years", type: "full-time" },
  { id: "V003", companyId: "C003", companyName: "Stripe", title: "Backend Engineer Intern", description: "Join the payments team for a 6-month internship.", positions: 10, location: "San Francisco, CA", locationType: "onsite", salary: "$8K/month", skills: ["Python", "Go", "PostgreSQL"], deadline: "2026-03-30", status: "active", applicants: 85, postedDate: "2026-02-15", experience: "Students", type: "internship" },
  { id: "V004", companyId: "C004", companyName: "Amazon", title: "SDE-1", description: "Build scalable systems for AWS.", positions: 8, location: "Remote", locationType: "remote", salary: "$140K-$175K", skills: ["Java", "AWS", "Docker"], deadline: "2026-04-20", status: "active", applicants: 120, postedDate: "2026-02-25", experience: "0-2 years", type: "full-time" },
  { id: "V005", companyId: "C005", companyName: "Netflix", title: "UI Engineer", description: "Create streaming experiences.", positions: 2, location: "Los Gatos, CA", locationType: "hybrid", salary: "$150K-$200K", skills: ["React", "TypeScript", "Node.js"], deadline: "2026-03-20", status: "closed", applicants: 95, postedDate: "2026-01-15", experience: "2-5 years", type: "full-time" },
];

export default function Vacancies() {
  const { user } = useAuth();
  const isCompany = user?.role === "company";
  const isStudent = user?.role === "student";

  const [vacancies, setVacancies] = useState(initialVacancies);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [newVacancy, setNewVacancy] = useState({ title: "", companyName: "", description: "", positions: "", location: "", locationType: "onsite", salary: "", skills: "", deadline: "", experience: "", type: "full-time" });

  const filtered = vacancies.filter((v) => {
    const q = search.toLowerCase();
    const matchSearch = !search || v.title.toLowerCase().includes(q) || v.companyName.toLowerCase().includes(q) || v.skills.some((s) => s.toLowerCase().includes(q));
    const matchType = typeFilter === "all" || v.type === typeFilter;
    const matchLocation = locationFilter === "all" || v.locationType === locationFilter;
    return matchSearch && matchType && matchLocation;
  });

  const handleCreate = () => {
    const vacancy: Vacancy = {
      id: `V${String(vacancies.length + 1).padStart(3, "0")}`,
      companyId: user?.companyId ?? "C001",
      companyName: newVacancy.companyName,
      title: newVacancy.title,
      description: newVacancy.description,
      positions: parseInt(newVacancy.positions) || 1,
      location: newVacancy.location,
      locationType: newVacancy.locationType as any,
      salary: newVacancy.salary,
      skills: newVacancy.skills.split(",").map((s) => s.trim()).filter(Boolean),
      deadline: newVacancy.deadline,
      status: "active",
      applicants: 0,
      postedDate: new Date().toISOString().split("T")[0],
      experience: newVacancy.experience,
      type: newVacancy.type as any,
    };
    setVacancies((prev) => [vacancy, ...prev]);
    setCreateOpen(false);
    setNewVacancy({ title: "", companyName: "", description: "", positions: "", location: "", locationType: "onsite", salary: "", skills: "", deadline: "", experience: "", type: "full-time" });
    toast({ title: "Vacancy posted", description: `${vacancy.title} at ${vacancy.companyName}` });
  };

  const handleApply = (vacancy: Vacancy) => {
    toast({ title: "Application submitted!", description: `Applied to ${vacancy.title} at ${vacancy.companyName}` });
  };

  const handleDelete = (id: string) => {
    setVacancies((prev) => prev.filter((v) => v.id !== id));
    setDeleteConfirm(null);
    toast({ title: "Vacancy deleted" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Board"
        description={isCompany ? "Post and manage job vacancies" : "Browse job opportunities from companies"}
        actions={isCompany ? (
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-1" /> Post Vacancy</Button></DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle className="font-display">Post New Vacancy</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-2 max-h-[60vh] overflow-y-auto pr-1">
                <div><Label>Job Title</Label><Input placeholder="Frontend Engineer" className="mt-1" value={newVacancy.title} onChange={(e) => setNewVacancy({ ...newVacancy, title: e.target.value })} /></div>
                <div><Label>Company Name</Label><Input placeholder="Google" className="mt-1" value={newVacancy.companyName} onChange={(e) => setNewVacancy({ ...newVacancy, companyName: e.target.value })} /></div>
                <div><Label>Description</Label><Textarea placeholder="Job description..." className="mt-1" value={newVacancy.description} onChange={(e) => setNewVacancy({ ...newVacancy, description: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Positions</Label><Input type="number" placeholder="5" className="mt-1" value={newVacancy.positions} onChange={(e) => setNewVacancy({ ...newVacancy, positions: e.target.value })} /></div>
                  <div><Label>Salary</Label><Input placeholder="$130K-$180K" className="mt-1" value={newVacancy.salary} onChange={(e) => setNewVacancy({ ...newVacancy, salary: e.target.value })} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Location</Label><Input placeholder="Mountain View, CA" className="mt-1" value={newVacancy.location} onChange={(e) => setNewVacancy({ ...newVacancy, location: e.target.value })} /></div>
                  <div><Label>Location Type</Label>
                    <Select value={newVacancy.locationType} onValueChange={(v) => setNewVacancy({ ...newVacancy, locationType: v })}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="onsite">On-site</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Experience</Label><Input placeholder="0-2 years" className="mt-1" value={newVacancy.experience} onChange={(e) => setNewVacancy({ ...newVacancy, experience: e.target.value })} /></div>
                  <div><Label>Type</Label>
                    <Select value={newVacancy.type} onValueChange={(v) => setNewVacancy({ ...newVacancy, type: v })}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label>Skills (comma-separated)</Label><Input placeholder="React, TypeScript, CSS" className="mt-1" value={newVacancy.skills} onChange={(e) => setNewVacancy({ ...newVacancy, skills: e.target.value })} /></div>
                <div><Label>Deadline</Label><Input type="date" className="mt-1" value={newVacancy.deadline} onChange={(e) => setNewVacancy({ ...newVacancy, deadline: e.target.value })} /></div>
                <Button className="w-full" onClick={handleCreate} disabled={!newVacancy.title || !newVacancy.companyName}>Post Vacancy</Button>
              </div>
            </DialogContent>
          </Dialog>
        ) : undefined}
      />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search jobs, companies, skills..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="full-time">Full-time</SelectItem>
            <SelectItem value="part-time">Part-time</SelectItem>
            <SelectItem value="internship">Internship</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
          </SelectContent>
        </Select>
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="onsite">On-site</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((v) => (
          <motion.div key={v.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5 hover:shadow-elevated transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold font-display">{v.title}</h3>
                  <p className="text-xs text-muted-foreground">{v.companyName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge variant={v.status === "active" ? "success" : "destructive"}>{v.status}</StatusBadge>
                {isCompany && (
                  <ActionMenu actions={[
                    { label: "Edit", icon: Edit, onClick: () => toast({ title: "Edit vacancy", description: "Edit dialog would open here" }) },
                    { label: "Delete", icon: Trash2, onClick: () => setDeleteConfirm(v.id), variant: "destructive", separator: true },
                  ]} />
                )}
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{v.description}</p>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {v.skills.map((s) => (
                <span key={s} className="px-2 py-0.5 rounded-md bg-secondary text-xs text-muted-foreground">{s}</span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {v.location}</span>
              <StatusBadge variant="outline">{v.locationType}</StatusBadge>
              <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {v.type}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {v.experience}</span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{v.salary}</span>
                <span>•</span>
                <span>{v.positions} positions</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {v.applicants} applicants</span>
              </div>
              {isStudent && v.status === "active" && (
                <Button size="sm" onClick={() => handleApply(v)}>
                  <ExternalLink className="w-3.5 h-3.5 mr-1" /> Apply
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">No vacancies found</div>
      )}

      <ConfirmDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)} title="Delete Vacancy" description="This will permanently remove the vacancy listing." confirmLabel="Delete" variant="destructive" onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)} />
    </div>
  );
}
