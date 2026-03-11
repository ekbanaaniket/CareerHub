// ============= Company Applications Page (Platform Owner) =============
// Grouped by Company → Vacancy → Applicants
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { CollapsibleEntityGroup } from "@/components/common/CollapsibleEntityGroup";
import { useCompanyApplications, useUpdateApplicantStatus } from "@/hooks/useCompanyApplications";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Building2, Users, CheckCircle, Clock, TrendingUp, Search,
  UserCheck, UserX, Calendar, Star, Briefcase, MapPin, ChevronDown, ChevronRight,
  Mail, Phone, GraduationCap, Award, Target, ArrowRight
} from "lucide-react";
import type { CompanyApplicationGroup, VacancyGroup, ApplicantDetail } from "@/services/companyApplications";

const STATUS_VARIANT: Record<string, "success" | "destructive" | "warning" | "info" | "outline" | "default"> = {
  applied: "outline",
  shortlisted: "info",
  interviewing: "warning",
  selected: "success",
  rejected: "destructive",
  offer_sent: "success",
  offer_accepted: "success",
  offer_declined: "destructive",
};

const STATUS_LABEL: Record<string, string> = {
  applied: "Applied",
  shortlisted: "Shortlisted",
  interviewing: "Interviewing",
  selected: "Selected",
  rejected: "Rejected",
  offer_sent: "Offer Sent",
  offer_accepted: "Offer Accepted",
  offer_declined: "Offer Declined",
};

function VacancySection({ vacancy }: { vacancy: VacancyGroup }) {
  const [expanded, setExpanded] = useState(true);
  const updateStatus = useUpdateApplicantStatus();

  const handleStatusChange = (applicantId: string, newStatus: ApplicantDetail["status"]) => {
    updateStatus.mutate(
      { applicantId, status: newStatus },
      {
        onSuccess: () => toast.success(`Status updated to ${STATUS_LABEL[newStatus]}`),
        onError: () => toast.error("Failed to update status"),
      }
    );
  };

  const fillRate = vacancy.positions > 0 ? Math.round((vacancy.stats.selected / vacancy.positions) * 100) : 0;

  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      {/* Vacancy Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 hover:bg-secondary/30 transition-colors"
      >
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Briefcase className="w-4.5 h-4.5 text-primary" />
        </div>
        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold font-display truncate">{vacancy.vacancyTitle}</h4>
            <StatusBadge variant={vacancy.status === "active" ? "success" : "destructive"}>{vacancy.status}</StatusBadge>
            <StatusBadge variant="outline">{vacancy.type}</StatusBadge>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{vacancy.location}</span>
            <span>{vacancy.salary}</span>
            <span>Deadline: {vacancy.deadline}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs shrink-0">
          <div className="text-center">
            <p className="font-semibold text-foreground text-sm">{vacancy.stats.total}</p>
            <p className="text-muted-foreground">Applicants</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-success text-sm">{vacancy.stats.selected}</p>
            <p className="text-muted-foreground">Selected</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground text-sm">{vacancy.stats.selected}/{vacancy.positions}</p>
            <p className="text-muted-foreground">Filled</p>
          </div>
          {expanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {/* Pipeline mini-bar */}
      <div className="px-4 pb-2">
        <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-secondary">
          {vacancy.stats.selected > 0 && <div className="bg-success rounded-full" style={{ width: `${(vacancy.stats.selected / vacancy.stats.total) * 100}%` }} />}
          {vacancy.stats.interviewing > 0 && <div className="bg-warning rounded-full" style={{ width: `${(vacancy.stats.interviewing / vacancy.stats.total) * 100}%` }} />}
          {vacancy.stats.shortlisted > 0 && <div className="bg-info rounded-full" style={{ width: `${(vacancy.stats.shortlisted / vacancy.stats.total) * 100}%` }} />}
          {vacancy.stats.applied > 0 && <div className="bg-muted-foreground/30 rounded-full" style={{ width: `${(vacancy.stats.applied / vacancy.stats.total) * 100}%` }} />}
          {vacancy.stats.rejected > 0 && <div className="bg-destructive/50 rounded-full" style={{ width: `${(vacancy.stats.rejected / vacancy.stats.total) * 100}%` }} />}
        </div>
        <div className="flex gap-3 mt-1.5 text-[10px] text-muted-foreground">
          {vacancy.stats.selected > 0 && <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-success" />Selected: {vacancy.stats.selected}</span>}
          {vacancy.stats.interviewing > 0 && <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-warning" />Interviewing: {vacancy.stats.interviewing}</span>}
          {vacancy.stats.shortlisted > 0 && <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-info" />Shortlisted: {vacancy.stats.shortlisted}</span>}
          {vacancy.stats.applied > 0 && <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />Applied: {vacancy.stats.applied}</span>}
          {vacancy.stats.rejected > 0 && <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-destructive/50" />Rejected: {vacancy.stats.rejected}</span>}
        </div>
      </div>

      {/* Applicants */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border">
              {vacancy.applicants.map((applicant, idx) => (
                <div
                  key={applicant.id}
                  className={`flex items-start gap-4 p-4 ${idx < vacancy.applicants.length - 1 ? "border-b border-border/50" : ""} hover:bg-secondary/20 transition-colors`}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                    {applicant.studentName.split(" ").map((n) => n[0]).join("")}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold">{applicant.studentName}</p>
                      <StatusBadge variant={STATUS_VARIANT[applicant.status] ?? "outline"}>
                        {STATUS_LABEL[applicant.status] ?? applicant.status}
                      </StatusBadge>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{applicant.studentEmail}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{applicant.phone}</span>
                      {applicant.institute && <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" />{applicant.institute}</span>}
                      {applicant.graduationYear && <span>Class of {applicant.graduationYear}</span>}
                      <span>{applicant.experience}</span>
                      <span>Applied: {applicant.appliedDate}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {applicant.skills.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-md bg-secondary text-[11px] text-muted-foreground">{s}</span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="w-3 h-3 text-warning" />
                        <span className="font-medium">{applicant.matchScore}%</span>
                        <span className="text-muted-foreground">match</span>
                      </div>
                      <Progress value={applicant.matchScore} className="w-20 h-1.5" />
                      {applicant.interviewDate && (
                        <span className="flex items-center gap-1 text-xs text-warning">
                          <Calendar className="w-3 h-3" /> Interview: {applicant.interviewDate}
                        </span>
                      )}
                      {applicant.offerSalary && (
                        <span className="flex items-center gap-1 text-xs text-success">
                          <Award className="w-3 h-3" /> Offer: {applicant.offerSalary}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1.5 shrink-0">
                    {applicant.status === "applied" && (
                      <>
                        <Button size="sm" variant="default" className="text-xs" onClick={() => handleStatusChange(applicant.id, "shortlisted")}>
                          <UserCheck className="w-3 h-3 mr-1" /> Shortlist
                        </Button>
                        <Button size="sm" variant="destructive" className="text-xs" onClick={() => handleStatusChange(applicant.id, "rejected")}>
                          <UserX className="w-3 h-3 mr-1" /> Reject
                        </Button>
                      </>
                    )}
                    {applicant.status === "shortlisted" && (
                      <>
                        <Button size="sm" variant="default" className="text-xs" onClick={() => handleStatusChange(applicant.id, "interviewing")}>
                          <Calendar className="w-3 h-3 mr-1" /> Interview
                        </Button>
                        <Button size="sm" variant="destructive" className="text-xs" onClick={() => handleStatusChange(applicant.id, "rejected")}>
                          <UserX className="w-3 h-3 mr-1" /> Reject
                        </Button>
                      </>
                    )}
                    {applicant.status === "interviewing" && (
                      <>
                        <Button size="sm" variant="default" className="text-xs" onClick={() => handleStatusChange(applicant.id, "selected")}>
                          <CheckCircle className="w-3 h-3 mr-1" /> Select
                        </Button>
                        <Button size="sm" variant="destructive" className="text-xs" onClick={() => handleStatusChange(applicant.id, "rejected")}>
                          <UserX className="w-3 h-3 mr-1" /> Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CompanySection({ company }: { company: CompanyApplicationGroup }) {
  return (
    <CollapsibleEntityGroup
      entityName={`${company.companyName} — ${company.industry}`}
      entityType="company"
      count={company.totalApplicants}
      defaultOpen={true}
    >
      <div className="space-y-4 pl-1">
        {/* Company summary row */}
        <div className="flex items-center gap-3 px-3 py-2 bg-secondary/30 rounded-lg">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-xs shrink-0">
            {company.companyLogo}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">{company.city}</p>
          </div>
          <div className="flex gap-4 text-xs">
            <div className="text-center">
              <p className="font-semibold">{company.totalVacancies}</p>
              <p className="text-muted-foreground">Vacancies</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">{company.totalApplicants}</p>
              <p className="text-muted-foreground">Applicants</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-success">{company.totalSelected}</p>
              <p className="text-muted-foreground">Selected</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-destructive">{company.totalRejected}</p>
              <p className="text-muted-foreground">Rejected</p>
            </div>
          </div>
        </div>

        {/* Vacancies */}
        <div className="space-y-3">
          {company.vacancies.map((vacancy) => (
            <VacancySection key={vacancy.vacancyId} vacancy={vacancy} />
          ))}
        </div>
      </div>
    </CollapsibleEntityGroup>
  );
}

export default function CompanyApplications() {
  const { data, isLoading } = useCompanyApplications();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState(searchParams.get("company") || "all");

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const { companies, overallStats } = data;

  // Filter companies
  const filteredCompanies = companies
    .filter((c) => companyFilter === "all" || c.companyId === companyFilter)
    .map((company) => ({
      ...company,
      vacancies: company.vacancies.map((v) => ({
        ...v,
        applicants: v.applicants.filter((a) => {
          const matchSearch = !search || a.studentName.toLowerCase().includes(search.toLowerCase()) || a.studentEmail.toLowerCase().includes(search.toLowerCase()) || a.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
          const matchStatus = statusFilter === "all" || a.status === statusFilter;
          return matchSearch && matchStatus;
        }),
      })).filter((v) => v.applicants.length > 0),
    }))
    .filter((c) => c.vacancies.length > 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Applications"
        description="All applications grouped by company and vacancy — manage the full recruitment pipeline"
      />

      {/* Overall Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Companies" value={String(overallStats.totalCompanies)} change={`${overallStats.totalVacancies} vacancies`} changeType="positive" icon={<Building2 className="w-5 h-5" />} />
        <StatCard title="Total Applicants" value={String(overallStats.totalApplicants)} change={`${overallStats.avgMatchScore}% avg match`} changeType="positive" icon={<Users className="w-5 h-5" />} />
        <StatCard title="Selected" value={String(overallStats.totalSelected)} change={`${overallStats.conversionRate}% conversion`} changeType="positive" icon={<CheckCircle className="w-5 h-5" />} />
        <StatCard title="Interviewing" value={String(overallStats.totalInterviewing)} change={`Avg ${overallStats.avgTimeToHire} to hire`} changeType="neutral" icon={<Clock className="w-5 h-5" />} />
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name, email, or skills..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={companyFilter} onValueChange={setCompanyFilter}>
          <SelectTrigger className="w-44"><SelectValue placeholder="All Companies" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            {companies.map((c) => <SelectItem key={c.companyId} value={c.companyId}>{c.companyName}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="shortlisted">Shortlisted</SelectItem>
            <SelectItem value="interviewing">Interviewing</SelectItem>
            <SelectItem value="selected">Selected</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Grouped by Company */}
      <div className="space-y-6">
        {filteredCompanies.map((company) => (
          <motion.div key={company.companyId} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <CompanySection company={company} />
          </motion.div>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">No applications found matching your filters</div>
      )}
    </div>
  );
}
