import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ExportButton } from "@/components/common/ExportButton";
import { ActionMenu } from "@/components/common/ActionMenu";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, Mail, Phone, Edit, Trash2, Eye, UserCheck, GraduationCap } from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useCanManage } from "@/hooks/useCanManage";
import { useAuth } from "@/contexts/AuthContext";
import { EntityGroupFilter, MOCK_INSTITUTES } from "@/components/common/EntityGroupFilter";

interface StudentData {
  id: string; name: string; email: string; phone: string; course: string; batch: string;
  status: "active" | "inactive" | "suspended"; progress: number; joinDate: string; instituteId: string; instituteName: string;
}

const initialStudents: StudentData[] = [
  { id: "S001", name: "Alice Johnson", email: "alice@email.com", phone: "+1 234-567-8901", course: "Full-Stack 2026", batch: "Batch A", status: "active", progress: 78, joinDate: "Jan 15, 2026", instituteId: "1", instituteName: "TechVerse Academy" },
  { id: "S002", name: "Bob Smith", email: "bob@email.com", phone: "+1 234-567-8902", course: "Full-Stack 2026", batch: "Batch A", status: "active", progress: 85, joinDate: "Jan 15, 2026", instituteId: "1", instituteName: "TechVerse Academy" },
  { id: "S003", name: "Carol Davis", email: "carol@email.com", phone: "+1 234-567-8903", course: "Full-Stack 2026", batch: "Batch B", status: "inactive", progress: 45, joinDate: "Feb 1, 2026", instituteId: "2", instituteName: "CodeMaster Institute" },
  { id: "S004", name: "David Lee", email: "david@email.com", phone: "+1 234-567-8904", course: "Full-Stack 2026", batch: "Batch A", status: "active", progress: 92, joinDate: "Jan 15, 2026", instituteId: "1", instituteName: "TechVerse Academy" },
  { id: "S005", name: "Eva Martinez", email: "eva@email.com", phone: "+1 234-567-8905", course: "Frontend Bootcamp", batch: "Batch C", status: "active", progress: 67, joinDate: "Feb 10, 2026", instituteId: "1", instituteName: "TechVerse Academy" },
  { id: "S006", name: "Frank Wilson", email: "frank@email.com", phone: "+1 234-567-8906", course: "Full-Stack 2026", batch: "Batch B", status: "suspended", progress: 30, joinDate: "Feb 1, 2026", instituteId: "2", instituteName: "CodeMaster Institute" },
  { id: "S007", name: "Grace Kim", email: "grace@email.com", phone: "+1 234-567-8907", course: "Backend Mastery", batch: "Batch A", status: "active", progress: 88, joinDate: "Jan 20, 2026", instituteId: "1", instituteName: "TechVerse Academy" },
  { id: "S008", name: "Henry Brown", email: "henry@email.com", phone: "+1 234-567-8908", course: "Frontend Bootcamp", batch: "Batch A", status: "active", progress: 73, joinDate: "Jan 15, 2026", instituteId: "1", instituteName: "TechVerse Academy" },
  { id: "S009", name: "Ian Thompson", email: "ian@email.com", phone: "+1 234-567-8909", course: "Backend Mastery", batch: "Batch B", status: "active", progress: 81, joinDate: "Feb 5, 2026", instituteId: "1", instituteName: "TechVerse Academy" },
  { id: "S010", name: "Julia Chen", email: "julia@email.com", phone: "+1 234-567-8910", course: "Full-Stack 2026", batch: "Batch C", status: "active", progress: 56, joinDate: "Feb 15, 2026", instituteId: "1", instituteName: "TechVerse Academy" },
];

export default function Students() {
  const { canCreate, canEdit, canDelete } = useCanManage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isPlatformOwner = user?.role === "platform_owner";
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [instituteFilter, setInstituteFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [newStudent, setNewStudent] = useState({ firstName: "", lastName: "", email: "", phone: "", course: "", batch: "" });

  const courses = useMemo(() => [...new Set(students.map((s) => s.course))], [students]);

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    const matchInstitute = instituteFilter === "all" || s.instituteId === instituteFilter;
    const matchCourse = courseFilter === "all" || s.course === courseFilter;
    return matchSearch && matchStatus && matchInstitute && matchCourse;
  });

  // Group by course for institute owner view
  const groupedByCourse = useMemo(() => {
    if (isPlatformOwner) return [];
    const map: Record<string, StudentData[]> = {};
    filtered.forEach((s) => {
      if (!map[s.course]) map[s.course] = [];
      map[s.course].push(s);
    });
    return Object.entries(map).map(([course, students]) => ({ course, students }));
  }, [filtered, isPlatformOwner]);

  // Group by institute for platform owner
  const groupedByInstitute = isPlatformOwner ? MOCK_INSTITUTES.map(inst => ({
    ...inst,
    students: filtered.filter(s => s.instituteId === inst.id),
  })).filter(g => g.students.length > 0) : [];

  const handleAdd = () => {
    const student: StudentData = {
      id: `S${String(students.length + 1).padStart(3, "0")}`,
      name: `${newStudent.firstName} ${newStudent.lastName}`,
      email: newStudent.email, phone: newStudent.phone,
      course: newStudent.course || "Full-Stack 2026", batch: newStudent.batch || "Batch A",
      status: "active", progress: 0,
      joinDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      instituteId: user?.instituteId ?? "1", instituteName: "TechVerse Academy",
    };
    setStudents((prev) => [...prev, student]);
    setAddOpen(false);
    setNewStudent({ firstName: "", lastName: "", email: "", phone: "", course: "", batch: "" });
    toast({ title: "Student added", description: `${student.name} has been enrolled.` });
  };

  const handleEdit = (student: StudentData) => { setSelectedStudent({ ...student }); setEditOpen(true); };
  const handleSaveEdit = () => {
    if (!selectedStudent) return;
    setStudents((prev) => prev.map((s) => (s.id === selectedStudent.id ? selectedStudent : s)));
    setEditOpen(false);
    toast({ title: "Student updated" });
  };
  const handleDelete = (id: string) => { setStudents((prev) => prev.filter((s) => s.id !== id)); setDeleteConfirm(null); toast({ title: "Student removed" }); };
  const handleToggleStatus = (student: StudentData) => {
    const newStatus = student.status === "active" ? "inactive" : "active";
    setStudents((prev) => prev.map((s) => s.id === student.id ? { ...s, status: newStatus } : s));
    toast({ title: `Student ${newStatus}` });
  };

  const renderTable = (data: StudentData[]) => (
    <DataTable headers={["Student", "Contact", "Course", "Batch", "Progress", "Status", "Joined", ""]}>
      {data.map((s) => (
        <tr key={s.id} className="hover:bg-secondary/30 transition-colors">
          <td className="px-4 py-3 cursor-pointer" onClick={() => navigate(`/students/${s.id}`)}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                {s.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div><p className="text-sm font-medium">{s.name}</p><p className="text-xs text-muted-foreground">{s.id}</p></div>
            </div>
          </td>
          <td className="px-4 py-3"><div className="text-xs space-y-0.5"><p className="flex items-center gap-1 text-muted-foreground"><Mail className="w-3 h-3" />{s.email}</p><p className="flex items-center gap-1 text-muted-foreground"><Phone className="w-3 h-3" />{s.phone}</p></div></td>
          <td className="px-4 py-3 text-sm">{s.course}</td>
          <td className="px-4 py-3 text-sm text-muted-foreground">{s.batch}</td>
          <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-20 h-2 rounded-full bg-secondary overflow-hidden"><div className="h-full rounded-full gradient-primary transition-all" style={{ width: `${s.progress}%` }} /></div><span className="text-xs font-medium">{s.progress}%</span></div></td>
          <td className="px-4 py-3"><StatusBadge variant={s.status === "active" ? "success" : s.status === "inactive" ? "warning" : "destructive"}>{s.status}</StatusBadge></td>
          <td className="px-4 py-3 text-sm text-muted-foreground">{s.joinDate}</td>
          <td className="px-4 py-3 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/students/${s.id}`)}
              className="w-8 h-8 p-0"
              title="View student details"
            >
              <Eye className="w-4 h-4" />
            </Button>
            {canEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(s)}
                className="w-8 h-8 p-0"
                title="Edit student"
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteConfirm(s.id)}
                className="w-8 h-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                title="Delete student"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </td>
        </tr>
      ))}
      {data.length === 0 && (<tr><td colSpan={8} className="px-4 py-12 text-center text-muted-foreground text-sm">No students found</td></tr>)}
    </DataTable>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description={isPlatformOwner ? "View students across all institutes" : `${students.length} students enrolled across all courses`}
        actions={
          <div className="flex gap-2">
            <ExportButton data={filtered as any} filename="students" headers={["id", "name", "email", "phone", "course", "batch", "status", "progress", "joinDate"]} />
            {canCreate && (
              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add Student</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle className="font-display">Add New Student</DialogTitle></DialogHeader>
                  <div className="space-y-4 mt-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label>First Name</Label><Input placeholder="John" className="mt-1" value={newStudent.firstName} onChange={(e) => setNewStudent({ ...newStudent, firstName: e.target.value })} /></div>
                      <div><Label>Last Name</Label><Input placeholder="Doe" className="mt-1" value={newStudent.lastName} onChange={(e) => setNewStudent({ ...newStudent, lastName: e.target.value })} /></div>
                    </div>
                    <div><Label>Email</Label><Input type="email" placeholder="john@email.com" className="mt-1" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} /></div>
                    <div><Label>Phone</Label><Input type="tel" placeholder="+1 234-567-8900" className="mt-1" value={newStudent.phone} onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })} /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label>Course</Label><Select value={newStudent.course} onValueChange={(v) => setNewStudent({ ...newStudent, course: v })}><SelectTrigger className="mt-1"><SelectValue placeholder="Select course" /></SelectTrigger><SelectContent><SelectItem value="Full-Stack 2026">Full-Stack 2026</SelectItem><SelectItem value="Frontend Bootcamp">Frontend Bootcamp</SelectItem><SelectItem value="Backend Mastery">Backend Mastery</SelectItem></SelectContent></Select></div>
                      <div><Label>Batch</Label><Select value={newStudent.batch} onValueChange={(v) => setNewStudent({ ...newStudent, batch: v })}><SelectTrigger className="mt-1"><SelectValue placeholder="Select batch" /></SelectTrigger><SelectContent><SelectItem value="Batch A">Batch A</SelectItem><SelectItem value="Batch B">Batch B</SelectItem><SelectItem value="Batch C">Batch C</SelectItem></SelectContent></Select></div>
                    </div>
                    <Button className="w-full" onClick={handleAdd} disabled={!newStudent.firstName || !newStudent.email}>Add Student</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        }
      />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name, email, or ID..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {isPlatformOwner && (
          <EntityGroupFilter label="Institutes" entities={MOCK_INSTITUTES} selected={instituteFilter} onSelect={setInstituteFilter} />
        )}
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
          <SelectTrigger className="w-40"><Filter className="w-4 h-4 mr-1" /><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem><SelectItem value="suspended">Suspended</SelectItem></SelectContent>
        </Select>
      </motion.div>

      {isPlatformOwner && instituteFilter === "all" ? (
        <div className="space-y-6">
          {groupedByInstitute.map(group => (
            <div key={group.id}>
              <h3 className="text-sm font-semibold font-display mb-3 flex items-center gap-2 text-primary">
                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center"><span className="text-xs font-bold">{group.name[0]}</span></div>
                {group.name} <span className="text-muted-foreground font-normal">({group.students.length})</span>
              </h3>
              {renderTable(group.students)}
            </div>
          ))}
        </div>
      ) : !isPlatformOwner && courseFilter === "all" ? (
        <div className="space-y-6">
          {groupedByCourse.map(group => (
            <div key={group.course}>
              <h3 className="text-sm font-semibold font-display mb-3 flex items-center gap-2 text-primary">
                <GraduationCap className="w-4 h-4" />
                {group.course} <span className="text-muted-foreground font-normal">({group.students.length})</span>
              </h3>
              {renderTable(group.students)}
            </div>
          ))}
        </div>
      ) : (
        renderTable(filtered)
      )}

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Edit Student</DialogTitle></DialogHeader>
          {selectedStudent && (
            <div className="space-y-4 mt-2">
              <div><Label>Name</Label><Input value={selectedStudent.name} onChange={(e) => setSelectedStudent({ ...selectedStudent, name: e.target.value })} className="mt-1" /></div>
              <div><Label>Email</Label><Input value={selectedStudent.email} onChange={(e) => setSelectedStudent({ ...selectedStudent, email: e.target.value })} className="mt-1" /></div>
              <div><Label>Phone</Label><Input value={selectedStudent.phone} onChange={(e) => setSelectedStudent({ ...selectedStudent, phone: e.target.value })} className="mt-1" /></div>
              <Button className="w-full" onClick={handleSaveEdit}>Save Changes</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)} title="Delete Student" description="Are you sure you want to remove this student?" confirmLabel="Delete" variant="destructive" onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)} />
    </div>
  );
}
