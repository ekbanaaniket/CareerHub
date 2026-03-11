import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus, Search, CheckCircle, Clock, XCircle, Eye, GraduationCap } from "lucide-react";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { z } from "zod";
import { ReusableForm, FormInput, FormSelect, FormTextarea } from "@/components/forms";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCanManage } from "@/hooks/useCanManage";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StatCard } from "@/components/common/StatCard";
import { EntityGroupFilter, MOCK_INSTITUTES } from "@/components/common/EntityGroupFilter";

const enrollmentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  course: z.string().min(1, "Select a course"),
  batch: z.string().min(1, "Select a batch"),
  city: z.string().optional(),
  notes: z.string().optional(),
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
});

type EnrollmentFormValues = z.infer<typeof enrollmentSchema>;

interface EnrollmentRequest {
  id: string;
  studentName: string;
  email: string;
  phone: string;
  course: string;
  batch: string;
  status: "pending" | "approved" | "rejected" | "enrolled";
  appliedDate: string;
  city?: string;
  notes?: string;
  instituteId: string;
  instituteName: string;
}

const mockEnrollments: EnrollmentRequest[] = [
  { id: "ENR001", studentName: "Arjun Patel", email: "arjun@email.com", phone: "+1 555-0101", course: "Full-Stack 2026", batch: "Batch A", status: "pending", appliedDate: "Mar 1, 2026", city: "Mumbai", instituteId: "1", instituteName: "TechVerse Academy" },
  { id: "ENR002", studentName: "Sophie Chen", email: "sophie@email.com", phone: "+1 555-0102", course: "Frontend Bootcamp", batch: "Batch B", status: "approved", appliedDate: "Feb 28, 2026", city: "Singapore", instituteId: "2", instituteName: "CodeMaster Institute" },
  { id: "ENR003", studentName: "James Wilson", email: "james@email.com", phone: "+1 555-0103", course: "Backend Mastery", batch: "Batch A", status: "enrolled", appliedDate: "Feb 25, 2026", city: "London", instituteId: "1", instituteName: "TechVerse Academy" },
  { id: "ENR004", studentName: "Priya Sharma", email: "priya@email.com", phone: "+1 555-0104", course: "Full-Stack 2026", batch: "Batch C", status: "rejected", appliedDate: "Feb 20, 2026", city: "Delhi", notes: "Prerequisite not met", instituteId: "3", instituteName: "Digital Skills Hub" },
  { id: "ENR005", studentName: "Liam O'Brien", email: "liam@email.com", phone: "+1 555-0105", course: "Frontend Bootcamp", batch: "Batch A", status: "pending", appliedDate: "Mar 2, 2026", city: "Dublin", instituteId: "1", instituteName: "TechVerse Academy" },
  { id: "ENR006", studentName: "Yuki Tanaka", email: "yuki@email.com", phone: "+1 555-0106", course: "Backend Mastery", batch: "Batch B", status: "approved", appliedDate: "Mar 3, 2026", city: "Tokyo", instituteId: "1", instituteName: "TechVerse Academy" },
];

export default function EnrollmentPage() {
  const { isViewOnly } = useCanManage();
  const { user } = useAuth();
  const isPlatformOwner = user?.role === "platform_owner";
  const { currentInstitute } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [instituteFilter, setInstituteFilter] = useState("all");
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentRequest | null>(null);
  const [enrollments, setEnrollments] = useState(mockEnrollments);

  const courses = useMemo(() => [...new Set(enrollments.map((e) => e.course))], [enrollments]);

  const filtered = enrollments.filter((e) => {
    const matchSearch = !search || e.studentName.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || e.status === statusFilter;
    const matchInstitute = instituteFilter === "all" || e.instituteId === instituteFilter;
    const matchCourse = courseFilter === "all" || e.course === courseFilter;
    return matchSearch && matchStatus && matchInstitute && matchCourse;
  });

  const stats = {
    pending: enrollments.filter(e => e.status === "pending").length,
    approved: enrollments.filter(e => e.status === "approved").length,
    enrolled: enrollments.filter(e => e.status === "enrolled").length,
    rejected: enrollments.filter(e => e.status === "rejected").length,
  };

  const handleEnroll = (values: EnrollmentFormValues) => {
    const newEnrollment: EnrollmentRequest = {
      id: `ENR${String(enrollments.length + 1).padStart(3, "0")}`,
      studentName: `${values.firstName} ${values.lastName}`,
      email: values.email,
      phone: values.phone,
      course: values.course,
      batch: values.batch,
      status: "pending",
      appliedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      city: values.city,
      notes: values.notes,
      instituteId: user?.instituteId ?? "1",
      instituteName: currentInstitute.name,
    };
    setEnrollments([newEnrollment, ...enrollments]);
    toast.success("Enrollment request submitted!");
    setEnrollOpen(false);
  };

  const updateStatus = (id: string, status: "approved" | "rejected" | "enrolled") => {
    setEnrollments(enrollments.map(e => e.id === id ? { ...e, status } : e));
    toast.success(`Enrollment ${status}`);
    setSelectedEnrollment(null);
  };

  // Group by institute for platform owner, by course for institute owner
  const groupedByInstitute = isPlatformOwner && instituteFilter === "all"
    ? MOCK_INSTITUTES.map(inst => ({ ...inst, enrollments: filtered.filter(e => e.instituteId === inst.id) })).filter(g => g.enrollments.length > 0)
    : [];

  const groupedByCourse = useMemo(() => {
    if (isPlatformOwner) return [];
    const map: Record<string, EnrollmentRequest[]> = {};
    filtered.forEach((e) => {
      if (!map[e.course]) map[e.course] = [];
      map[e.course].push(e);
    });
    return Object.entries(map).map(([course, enrollments]) => ({ course, enrollments }));
  }, [filtered, isPlatformOwner]);

  const renderEnrollmentList = (data: EnrollmentRequest[]) => (
    <div className="space-y-3">
      {data.map((e, i) => (
        <motion.div key={e.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
          className="bg-card rounded-xl border border-border shadow-card p-4 flex items-center gap-4 cursor-pointer hover:bg-secondary/30 transition-colors"
          onClick={() => setSelectedEnrollment(e)}
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
            {e.studentName.split(" ").map(n => n[0]).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{e.studentName}</p>
            <p className="text-xs text-muted-foreground">{e.email} · {e.course}</p>
          </div>
          <div className="hidden sm:block text-xs text-muted-foreground">{e.batch}</div>
          <StatusBadge variant={e.status === "enrolled" ? "success" : e.status === "approved" ? "info" : e.status === "rejected" ? "destructive" : "warning"}>{e.status}</StatusBadge>
          <span className="text-xs text-muted-foreground hidden md:block">{e.appliedDate}</span>
          <Eye className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      ))}
      {data.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">No enrollment requests found</div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Enrollment"
        description={isPlatformOwner ? "View enrollment requests across all institutes" : "Manage enrollment requests and student onboarding"}
        actions={!isViewOnly ? (
          <Dialog open={enrollOpen} onOpenChange={setEnrollOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><UserPlus className="w-4 h-4 mr-1" /> New Enrollment</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto">
              <DialogHeader><DialogTitle className="font-display">New Enrollment Request</DialogTitle></DialogHeader>
              <ReusableForm
                schema={enrollmentSchema}
                defaultValues={{ firstName: "", lastName: "", email: "", phone: "", course: "", batch: "", city: "", notes: "", guardianName: "", guardianPhone: "" }}
                onSubmit={handleEnroll}
                submitLabel="Submit Enrollment"
              >
                {(form) => (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <FormInput form={form} name="firstName" label="First Name" placeholder="John" />
                      <FormInput form={form} name="lastName" label="Last Name" placeholder="Doe" />
                    </div>
                    <FormInput form={form} name="email" label="Email" placeholder="john@email.com" type="email" />
                    <FormInput form={form} name="phone" label="Phone" placeholder="+1 234-567-8900" />
                    <FormInput form={form} name="city" label="City" placeholder="San Francisco" />
                    <div className="grid grid-cols-2 gap-3">
                      <FormSelect form={form} name="course" label="Course" placeholder="Select course" options={[
                        { value: "Full-Stack 2026", label: "Full-Stack 2026" },
                        { value: "Frontend Bootcamp", label: "Frontend Bootcamp" },
                        { value: "Backend Mastery", label: "Backend Mastery" },
                      ]} />
                      <FormSelect form={form} name="batch" label="Batch" placeholder="Select batch" options={[
                        { value: "Batch A", label: "Batch A" },
                        { value: "Batch B", label: "Batch B" },
                        { value: "Batch C", label: "Batch C" },
                      ]} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <FormInput form={form} name="guardianName" label="Guardian Name" placeholder="Optional" />
                      <FormInput form={form} name="guardianPhone" label="Guardian Phone" placeholder="Optional" />
                    </div>
                    <FormTextarea form={form} name="notes" label="Notes" placeholder="Any additional information..." />
                  </>
                )}
              </ReusableForm>
            </DialogContent>
          </Dialog>
        ) : undefined}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Pending" value={String(stats.pending)} icon={<Clock className="w-5 h-5" />} change="Awaiting review" changeType="neutral" />
        <StatCard title="Approved" value={String(stats.approved)} icon={<CheckCircle className="w-5 h-5" />} change="Ready to enroll" changeType="positive" />
        <StatCard title="Enrolled" value={String(stats.enrolled)} icon={<UserPlus className="w-5 h-5" />} change="Active students" changeType="positive" />
        <StatCard title="Rejected" value={String(stats.rejected)} icon={<XCircle className="w-5 h-5" />} change="Not qualified" changeType="negative" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name or email..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {isPlatformOwner && <EntityGroupFilter label="Institutes" entities={MOCK_INSTITUTES} selected={instituteFilter} onSelect={setInstituteFilter} />}
        {!isPlatformOwner && (
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-44"><GraduationCap className="w-4 h-4 mr-1" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="enrolled">Enrolled</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isPlatformOwner && instituteFilter === "all" ? (
        <div className="space-y-6">
          {groupedByInstitute.map(group => (
            <div key={group.id}>
              <h3 className="text-sm font-semibold font-display mb-3 flex items-center gap-2 text-primary">
                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center"><span className="text-xs font-bold">{group.name[0]}</span></div>
                {group.name} <span className="text-muted-foreground font-normal">({group.enrollments.length})</span>
              </h3>
              {renderEnrollmentList(group.enrollments)}
            </div>
          ))}
        </div>
      ) : !isPlatformOwner && courseFilter === "all" ? (
        <div className="space-y-6">
          {groupedByCourse.map(group => (
            <div key={group.course}>
              <h3 className="text-sm font-semibold font-display mb-3 flex items-center gap-2 text-primary">
                <GraduationCap className="w-4 h-4" />
                {group.course} <span className="text-muted-foreground font-normal">({group.enrollments.length})</span>
              </h3>
              {renderEnrollmentList(group.enrollments)}
            </div>
          ))}
        </div>
      ) : (
        renderEnrollmentList(filtered)
      )}

      {/* Detail Sheet */}
      <Sheet open={!!selectedEnrollment} onOpenChange={(open) => !open && setSelectedEnrollment(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="font-display">Enrollment Details</SheetTitle>
          </SheetHeader>
          {selectedEnrollment && (
            <div className="space-y-6 mt-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                  {selectedEnrollment.studentName.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedEnrollment.studentName}</h3>
                  <p className="text-sm text-muted-foreground">{selectedEnrollment.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  ["Phone", selectedEnrollment.phone],
                  ["Course", selectedEnrollment.course],
                  ["Batch", selectedEnrollment.batch],
                  ["City", selectedEnrollment.city || "—"],
                  ["Applied", selectedEnrollment.appliedDate],
                  ["Status", selectedEnrollment.status],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm font-medium capitalize">{value}</span>
                  </div>
                ))}
                {selectedEnrollment.notes && (
                  <div className="pt-2">
                    <span className="text-sm text-muted-foreground">Notes</span>
                    <p className="text-sm mt-1">{selectedEnrollment.notes}</p>
                  </div>
                )}
              </div>
              {!isViewOnly && selectedEnrollment.status === "pending" && (
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => updateStatus(selectedEnrollment.id, "approved")}>
                    <CheckCircle className="w-4 h-4 mr-1" /> Approve
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={() => updateStatus(selectedEnrollment.id, "rejected")}>
                    <XCircle className="w-4 h-4 mr-1" /> Reject
                  </Button>
                </div>
              )}
              {!isViewOnly && selectedEnrollment.status === "approved" && (
                <Button className="w-full" onClick={() => updateStatus(selectedEnrollment.id, "enrolled")}>
                  <UserPlus className="w-4 h-4 mr-1" /> Complete Enrollment
                </Button>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
