// ============= Company Dashboard & Applicants View =============
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanyDashboard, useUpdateApplicationStatus } from "@/hooks/useCompanyDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";
import {
  Briefcase, Users, CheckCircle, Clock, TrendingUp, Search,
  UserCheck, UserX, Calendar, Star, Building2, ArrowRight
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const STATUS_ACTIONS: Record<string, { next: string; label: string; variant: "default" | "destructive" | "outline" }[]> = {
  applied: [
    { next: "shortlisted", label: "Shortlist", variant: "default" },
    { next: "rejected", label: "Reject", variant: "destructive" },
  ],
  shortlisted: [
    { next: "interviewing", label: "Schedule Interview", variant: "default" },
    { next: "rejected", label: "Reject", variant: "destructive" },
  ],
  interviewing: [
    { next: "selected", label: "Select", variant: "default" },
    { next: "rejected", label: "Reject", variant: "destructive" },
  ],
  selected: [],
  rejected: [],
};

export default function CompanyDashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useCompanyDashboard(user?.companyId ?? "C001");
  const updateStatus = useUpdateApplicationStatus();
  const [tab, setTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [vacancyFilter, setVacancyFilter] = useState("all");

  const handleStatusChange = (applicationId: string, newStatus: string) => {
    updateStatus.mutate({ applicationId, status: newStatus }, {
      onSuccess: () => toast.success(`Status updated to ${newStatus}`),
      onError: () => toast.error("Failed to update status"),
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!data) return <div className="text-center py-12 text-muted-foreground">No data available</div>;

  const filteredApplicants = data.applicants.filter((a) => {
    const matchSearch = !search || a.studentName.toLowerCase().includes(search.toLowerCase()) || a.vacancyTitle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    const matchVacancy = vacancyFilter === "all" || a.vacancyId === vacancyFilter;
    return matchSearch && matchStatus && matchVacancy;
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Company Dashboard" description="Manage vacancies, applicants, and recruitment pipeline" />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Vacancies" value={String(data.stats.activeVacancies)} change={`${data.stats.totalVacancies} total`} changeType="positive" icon={<Briefcase className="w-5 h-5" />} />
        <StatCard title="Total Applicants" value={String(data.stats.totalApplicants)} change={`${data.stats.shortlisted} shortlisted`} changeType="positive" icon={<Users className="w-5 h-5" />} />
        <StatCard title="Selected" value={String(data.stats.selected)} change={`${data.stats.offerAcceptRate}% acceptance`} changeType="positive" icon={<CheckCircle className="w-5 h-5" />} />
        <StatCard title="Avg Time to Hire" value={data.stats.avgTimeToHire} change={`${data.stats.interviewsScheduled} interviews pending`} changeType="neutral" icon={<Clock className="w-5 h-5" />} />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="overview"><TrendingUp className="w-3.5 h-3.5 mr-1" />Overview</TabsTrigger>
          <TabsTrigger value="applicants"><Users className="w-3.5 h-3.5 mr-1" />Applicants</TabsTrigger>
          <TabsTrigger value="vacancies"><Briefcase className="w-3.5 h-3.5 mr-1" />Vacancies</TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Activity */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 bg-card rounded-xl border border-border shadow-card p-5">
            <h3 className="text-sm font-semibold font-display mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {data.recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${activity.type === "success" ? "bg-success/10 text-success" : activity.type === "warning" ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary"}`}>
                    {activity.type === "success" ? <CheckCircle className="w-4 h-4" /> : activity.type === "warning" ? <Calendar className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.applicant} · {activity.vacancy}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Vacancy Pipeline */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border shadow-card p-5">
            <h3 className="text-sm font-semibold font-display mb-4">Recruitment Pipeline</h3>
            <div className="space-y-3">
              {[
                { label: "Applied", count: data.stats.totalApplicants, color: "bg-primary" },
                { label: "Shortlisted", count: data.stats.shortlisted, color: "bg-warning" },
                { label: "Interviewing", count: data.stats.interviewsScheduled, color: "bg-info" },
                { label: "Selected", count: data.stats.selected, color: "bg-success" },
              ].map((stage) => (
                <div key={stage.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{stage.label}</span>
                    <span className="font-medium">{stage.count}</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full ${stage.color} rounded-full transition-all`} style={{ width: `${(stage.count / data.stats.totalApplicants) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {tab === "applicants" && (
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search applicants..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="interviewing">Interviewing</SelectItem>
                <SelectItem value="selected">Selected</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={vacancyFilter} onValueChange={setVacancyFilter}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Vacancy" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vacancies</SelectItem>
                {data.vacancies.map((v) => <SelectItem key={v.id} value={v.id}>{v.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </motion.div>

          <div className="space-y-3">
            {filteredApplicants.map((applicant) => (
              <motion.div key={applicant.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-xl border border-border shadow-card p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                    {applicant.studentName.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold">{applicant.studentName}</p>
                      <StatusBadge variant={applicant.status === "selected" ? "success" : applicant.status === "rejected" ? "destructive" : applicant.status === "interviewing" ? "warning" : applicant.status === "shortlisted" ? "info" : "outline"}>
                        {applicant.status}
                      </StatusBadge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{applicant.studentEmail} · {applicant.experience}</p>
                    <p className="text-xs text-muted-foreground mb-2">Applied for: <span className="font-medium text-foreground">{applicant.vacancyTitle}</span> · {applicant.appliedDate}</p>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {applicant.skills.map((s) => <span key={s} className="px-2 py-0.5 rounded-md bg-secondary text-[11px] text-muted-foreground">{s}</span>)}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="w-3 h-3 text-warning" />
                        <span className="font-medium">{applicant.matchScore}%</span>
                        <span className="text-muted-foreground">match</span>
                      </div>
                      <Progress value={applicant.matchScore} className="w-20 h-1.5" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    {STATUS_ACTIONS[applicant.status]?.map((action) => (
                      <Button key={action.next} variant={action.variant} size="sm" className="text-xs" onClick={() => handleStatusChange(applicant.id, action.next)} disabled={updateStatus.isPending}>
                        {action.next === "shortlisted" && <UserCheck className="w-3 h-3 mr-1" />}
                        {action.next === "rejected" && <UserX className="w-3 h-3 mr-1" />}
                        {action.next === "interviewing" && <Calendar className="w-3 h-3 mr-1" />}
                        {action.next === "selected" && <CheckCircle className="w-3 h-3 mr-1" />}
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
            {filteredApplicants.length === 0 && <div className="text-center py-12 text-muted-foreground text-sm">No applicants found</div>}
          </div>
        </div>
      )}

      {tab === "vacancies" && (
        <div className="space-y-3">
          {data.vacancies.map((vacancy) => (
            <motion.div key={vacancy.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-xl border border-border shadow-card p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Building2 className="w-5 h-5 text-primary" /></div>
                  <div>
                    <h3 className="text-sm font-semibold font-display">{vacancy.title}</h3>
                    <p className="text-xs text-muted-foreground">Posted {vacancy.postedDate} · Deadline {vacancy.deadline}</p>
                  </div>
                </div>
                <StatusBadge variant={vacancy.status === "active" ? "success" : "destructive"}>{vacancy.status}</StatusBadge>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-2 rounded-lg bg-secondary/30 text-center">
                  <p className="text-xs text-muted-foreground">Applicants</p>
                  <p className="text-lg font-display font-bold">{vacancy.applicants}</p>
                </div>
                <div className="p-2 rounded-lg bg-warning/10 text-center">
                  <p className="text-xs text-muted-foreground">Shortlisted</p>
                  <p className="text-lg font-display font-bold text-warning">{vacancy.shortlisted}</p>
                </div>
                <div className="p-2 rounded-lg bg-success/10 text-center">
                  <p className="text-xs text-muted-foreground">Selected</p>
                  <p className="text-lg font-display font-bold text-success">{vacancy.selected}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
