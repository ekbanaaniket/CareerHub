import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatCard } from "@/components/common/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Briefcase, Building2, TrendingUp, Users, Calendar, MapPin, DollarSign } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { usePlacements, usePlacementDrives, useCreatePlacement } from "@/hooks/usePlacements";
import { useApp } from "@/contexts/AppContext";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { z } from "zod";
import { ReusableForm, FormInput, FormSelect } from "@/components/forms";
import { useCanManage } from "@/hooks/useCanManage";

const placementSchema = z.object({
  studentName: z.string().min(1, "Student name is required"),
  studentId: z.string().min(1, "Student ID is required"),
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  package: z.string().min(1, "Package is required"),
  city: z.string().min(1, "City is required"),
  status: z.string().min(1, "Status is required"),
});

type PlacementFormValues = z.infer<typeof placementSchema>;

export default function PlacementsPage() {
  const { currentInstitute } = useApp();
  const { isViewOnly } = useCanManage();
  const [tab, setTab] = useState("placements");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const { data: placements, isLoading: placementsLoading } = usePlacements({ search, status: statusFilter, city: cityFilter, instituteId: currentInstitute.id });
  const { data: drives, isLoading: drivesLoading } = usePlacementDrives(currentInstitute.id);
  const createMutation = useCreatePlacement();

  const handleCreate = async (values: PlacementFormValues) => {
    try {
      await createMutation.mutateAsync({
        studentName: values.studentName,
        studentId: values.studentId,
        company: values.company,
        position: values.position,
        package: values.package,
        city: values.city,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        instituteId: currentInstitute.id,
        status: values.status as any,
      });
      toast.success("Placement recorded successfully");
      setAddOpen(false);
    } catch {
      toast.error("Failed to record placement");
    }
  };

  const placedCount = placements?.filter((p) => p.status === "placed").length ?? 0;
  const offeredCount = placements?.filter((p) => p.status === "offered").length ?? 0;
  const interviewingCount = placements?.filter((p) => p.status === "interviewing").length ?? 0;
  const uniqueCompanies = new Set(placements?.map((p) => p.company)).size;

  const statusVariant = (s: string) => {
    switch (s) {
      case "placed": return "success";
      case "offered": return "info";
      case "interviewing": return "warning";
      case "rejected": return "destructive";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Placements"
        description="Track student placements and manage placement drives"
        actions={!isViewOnly ? (
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Record Placement</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-display">Record New Placement</DialogTitle></DialogHeader>
              <ReusableForm
                schema={placementSchema}
                defaultValues={{ studentName: "", studentId: "", company: "", position: "", package: "", city: "", status: "offered" }}
                onSubmit={handleCreate}
                submitLabel="Record Placement"
                isLoading={createMutation.isPending}
              >
                {(form) => (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput form={form} name="studentName" label="Student Name" placeholder="John Doe" />
                      <FormInput form={form} name="studentId" label="Student ID" placeholder="S001" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput form={form} name="company" label="Company" placeholder="Google" />
                      <FormInput form={form} name="position" label="Position" placeholder="Frontend Engineer" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput form={form} name="package" label="Package" placeholder="$145,000" />
                      <FormInput form={form} name="city" label="City" placeholder="San Francisco" />
                    </div>
                    <FormSelect form={form} name="status" label="Status" options={[
                      { value: "placed", label: "Placed" },
                      { value: "offered", label: "Offered" },
                      { value: "interviewing", label: "Interviewing" },
                      { value: "rejected", label: "Rejected" },
                    ]} />
                  </>
                )}
              </ReusableForm>
            </DialogContent>
          </Dialog>
        ) : undefined}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {placementsLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
        ) : (
          <>
            <StatCard title="Total Placed" value={String(placedCount)} change="This academic year" changeType="positive" icon={<Briefcase className="w-5 h-5" />} />
            <StatCard title="Active Offers" value={String(offeredCount)} change="Pending acceptance" changeType="neutral" icon={<DollarSign className="w-5 h-5" />} />
            <StatCard title="Interviewing" value={String(interviewingCount)} change="In pipeline" changeType="neutral" icon={<Users className="w-5 h-5" />} />
            <StatCard title="Companies" value={String(uniqueCompanies)} change="Partner companies" changeType="positive" icon={<Building2 className="w-5 h-5" />} />
          </>
        )}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="placements"><Briefcase className="w-3.5 h-3.5 mr-1" />Placements</TabsTrigger>
          <TabsTrigger value="drives"><Building2 className="w-3.5 h-3.5 mr-1" />Placement Drives</TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "placements" ? (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by student, company, or position..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Input placeholder="Filter by city..." className="w-40" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="placed">Placed</SelectItem>
                <SelectItem value="offered">Offered</SelectItem>
                <SelectItem value="interviewing">Interviewing</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {placementsLoading ? <Skeleton className="h-64 rounded-xl" /> : (
            <DataTable headers={["Student", "Company", "Position", "Package", "City", "Date", "Status"]}>
              {placements?.map((p) => (
                <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                        {p.studentName.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{p.studentName}</p>
                        <p className="text-xs text-muted-foreground">{p.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">{p.company}</td>
                  <td className="px-4 py-3 text-sm">{p.position}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-success">{p.package}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{p.city}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{p.date}</td>
                  <td className="px-4 py-3"><StatusBadge variant={statusVariant(p.status) as any}>{p.status}</StatusBadge></td>
                </tr>
              ))}
              {(!placements || placements.length === 0) && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground text-sm">No placements found</td></tr>
              )}
            </DataTable>
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {drivesLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)
          ) : (
            drives?.map((drive) => (
              <motion.div key={drive.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5 hover:shadow-elevated transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold font-display">{drive.company}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{drive.city}</p>
                    </div>
                  </div>
                  <StatusBadge variant={drive.status === "completed" ? "success" : drive.status === "ongoing" ? "warning" : "info"}>{drive.status}</StatusBadge>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {drive.positions.map((pos) => (
                    <span key={pos} className="px-2 py-0.5 rounded-md bg-secondary text-xs text-muted-foreground">{pos}</span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{drive.date}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{drive.registeredStudents} registered</span>
                  <span className="flex items-center gap-1 font-semibold text-success"><DollarSign className="w-3 h-3" />{drive.packageRange}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
