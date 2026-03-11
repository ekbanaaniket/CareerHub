import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EntityGroupFilter, MOCK_INSTITUTES } from "@/components/common/EntityGroupFilter";
import { CollapsibleEntityGroup } from "@/components/common/CollapsibleEntityGroup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Download, MoreHorizontal, Mail, Phone, Building2 } from "lucide-react";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useStudents, useCreateStudent } from "@/hooks/useStudents";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { z } from "zod";
import { ReusableForm, FormInput, FormSelect } from "@/components/forms";

const studentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  course: z.string().min(1, "Select a course"),
  batch: z.string().min(1, "Select a batch"),
  city: z.string().optional(),
});

type StudentFormValues = z.infer<typeof studentSchema>;

export default function StudentsPage() {
  const { currentInstitute } = useApp();
  const { user } = useAuth();
  const { canCreate, isViewOnly } = useRoleAccess();
  const isPlatformOwner = user?.role === "platform_owner";

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [entityFilter, setEntityFilter] = useState("all");

  // For platform owner, fetch all students (no instituteId filter) or filtered by entity
  const instituteIdParam = isPlatformOwner
    ? (entityFilter !== "all" ? entityFilter : undefined)
    : currentInstitute.id;

  const { data: students, isLoading } = useStudents({ search, status: statusFilter, instituteId: instituteIdParam });
  const createMutation = useCreateStudent();

  // Group students by institute for platform owner view
  const groupedStudents = useMemo(() => {
    if (!isPlatformOwner || !students) return null;
    const groups: Record<string, { instituteName: string; students: typeof students }> = {};
    for (const s of students) {
      const instId = s.instituteId ?? "unknown";
      const instName = MOCK_INSTITUTES.find((i) => i.id === instId)?.name ?? `Institute ${instId}`;
      if (!groups[instId]) groups[instId] = { instituteName: instName, students: [] };
      groups[instId].students.push(s);
    }
    return groups;
  }, [isPlatformOwner, students]);

  const handleCreate = async (values: StudentFormValues) => {
    try {
      await createMutation.mutateAsync({
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        phone: values.phone,
        course: values.course,
        batch: values.batch,
        status: "active",
        progress: 0,
        joinDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        instituteId: currentInstitute.id,
        city: values.city,
      });
      toast.success("Student added successfully");
      setAddOpen(false);
    } catch {
      toast.error("Failed to add student");
    }
  };

  const renderStudentRow = (s: any) => (
    <tr key={s.id} className="hover:bg-secondary/30 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
            {s.name.split(" ").map((n: string) => n[0]).join("")}
          </div>
          <div>
            <p className="text-sm font-medium">{s.name}</p>
            <p className="text-xs text-muted-foreground">{s.id} {s.city && `• ${s.city}`}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="text-xs space-y-0.5">
          <p className="flex items-center gap-1 text-muted-foreground"><Mail className="w-3 h-3" />{s.email}</p>
          <p className="flex items-center gap-1 text-muted-foreground"><Phone className="w-3 h-3" />{s.phone}</p>
        </div>
      </td>
      <td className="px-4 py-3 text-sm">{s.course}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{s.batch}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-20 h-2 rounded-full bg-secondary overflow-hidden">
            <div className="h-full rounded-full gradient-primary transition-all" style={{ width: `${s.progress}%` }} />
          </div>
          <span className="text-xs font-medium">{s.progress}%</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <StatusBadge variant={s.status === "active" ? "success" : s.status === "inactive" ? "warning" : "destructive"}>{s.status}</StatusBadge>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{s.joinDate}</td>
      <td className="px-4 py-3">
        <button className="p-1 rounded hover:bg-secondary transition-colors"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></button>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description={isPlatformOwner ? "View all students across institutes" : `${students?.length ?? 0} students enrolled across all courses`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" /> Export</Button>
            {canCreate && (
              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild>
                  <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add Student</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle className="font-display">Add New Student</DialogTitle></DialogHeader>
                  <ReusableForm
                    schema={studentSchema}
                    defaultValues={{ firstName: "", lastName: "", email: "", phone: "", course: "", batch: "", city: "" }}
                    onSubmit={handleCreate}
                    submitLabel="Add Student"
                    isLoading={createMutation.isPending}
                  >
                    {(form) => (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <FormInput form={form} name="firstName" label="First Name" placeholder="John" />
                          <FormInput form={form} name="lastName" label="Last Name" placeholder="Doe" />
                        </div>
                        <FormInput form={form} name="email" label="Email" placeholder="john@email.com" type="email" />
                        <FormInput form={form} name="phone" label="Phone" placeholder="+1 234-567-8900" />
                        <FormInput form={form} name="city" label="City" placeholder="San Francisco" />
                        <div className="grid grid-cols-2 gap-4">
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
                      </>
                    )}
                  </ReusableForm>
                </DialogContent>
              </Dialog>
            )}
          </div>
        }
      />

      {/* Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col sm:flex-row gap-3">
        {isPlatformOwner && (
          <EntityGroupFilter label="Institutes" entities={MOCK_INSTITUTES} selected={entityFilter} onSelect={setEntityFilter} />
        )}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name, email, ID, or city..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
      ) : isPlatformOwner && groupedStudents && entityFilter === "all" ? (
        // Grouped view for platform owner
        <div className="space-y-6">
          {Object.entries(groupedStudents).map(([instId, group]) => (
            <CollapsibleEntityGroup key={instId} entityName={group.instituteName} entityType="institute" count={group.students.length}>
              <DataTable headers={["Student", "Contact", "Course", "Batch", "Progress", "Status", "Joined", ""]}>
                {group.students.map(renderStudentRow)}
              </DataTable>
            </CollapsibleEntityGroup>
          ))}
          {Object.keys(groupedStudents).length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">No students found</div>
          )}
        </div>
      ) : (
        // Regular flat view
        <DataTable headers={["Student", "Contact", "Course", "Batch", "Progress", "Status", "Joined", ""]}>
          {students?.map(renderStudentRow)}
          {(!students || students.length === 0) && (
            <tr><td colSpan={8} className="px-4 py-12 text-center text-muted-foreground text-sm">No students found</td></tr>
          )}
        </DataTable>
      )}
    </div>
  );
}
