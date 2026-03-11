import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield, Plus, Users, Eye, Edit, Trash2, Settings, Key, ChevronRight, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { ROLE_CONFIGS, getPermissionsForRole, type Permission, type AppRole } from "@/config/roles";
import { Alert, AlertDescription } from "@/components/ui/alert";

const roles = [
  {
    id: 1, name: "Super Admin", description: "Full access to all institutes and features", users: 2, type: "system",
    permissions: { dashboard: true, students: true, tests: true, progress: true, library: true, lectures: true, courses: true, roles: true, settings: true, billing: true }
  },
  {
    id: 2, name: "Institute Owner", description: "Full access to their own institute", users: 3, type: "system",
    permissions: { dashboard: true, students: true, tests: true, progress: true, library: true, lectures: true, courses: true, roles: true, settings: true, billing: true }
  },
  {
    id: 3, name: "Admin", description: "Manage students, tests, and content", users: 5, type: "custom",
    permissions: { dashboard: true, students: true, tests: true, progress: true, library: true, lectures: true, courses: true, roles: false, settings: false, billing: false }
  },
  {
    id: 4, name: "Instructor", description: "Create and manage course content and tests", users: 12, type: "custom",
    permissions: { dashboard: true, students: false, tests: true, progress: true, library: true, lectures: true, courses: true, roles: false, settings: false, billing: false }
  },
  {
    id: 5, name: "Student", description: "View courses, take tests, access library", users: 1284, type: "system",
    permissions: { dashboard: true, students: false, tests: false, progress: false, library: true, lectures: true, courses: true, roles: false, settings: false, billing: false }
  },
];

const teamMembers = [
  { id: 1, name: "John Doe", email: "john@techverse.com", role: "Super Admin", status: "active", lastActive: "2 min ago" },
  { id: 2, name: "Jane Smith", email: "jane@techverse.com", role: "Instructor", status: "active", lastActive: "1 hr ago" },
  { id: 3, name: "Mike Johnson", email: "mike@techverse.com", role: "Admin", status: "active", lastActive: "3 hrs ago" },
  { id: 4, name: "Sarah Wilson", email: "sarah@techverse.com", role: "Instructor", status: "inactive", lastActive: "2 days ago" },
  { id: 5, name: "Tom Brown", email: "tom@techverse.com", role: "Instructor", status: "active", lastActive: "30 min ago" },
];

// All possible permissions for the UI
const ALL_PERMISSIONS: { key: string; label: string }[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "students", label: "Students" },
  { key: "enrollment", label: "Enrollment" },
  { key: "tests", label: "Tests & Exams" },
  { key: "progress", label: "Progress Reports" },
  { key: "library", label: "Library" },
  { key: "lectures", label: "Lectures" },
  { key: "courses", label: "Courses" },
  { key: "roles", label: "Roles & Permissions" },
  { key: "settings", label: "Settings" },
  { key: "billing", label: "Billing" },
  { key: "fees", label: "Fees" },
  { key: "attendance", label: "Attendance" },
  { key: "announcements", label: "Announcements" },
  { key: "placements", label: "Placements" },
  { key: "vacancies", label: "Vacancies" },
  { key: "visa_tracking", label: "Visa Tracking" },
  { key: "university_applications", label: "University Apps" },
  { key: "language_courses", label: "Language Courses" },
  { key: "counselor_management", label: "Counselor Management" },
  { key: "consultancy_manage", label: "Consultancy Management" },
  { key: "institutes_manage", label: "Institutes Management" },
  { key: "institutes_view", label: "Institutes View" },
  { key: "company_vacancies", label: "Company Vacancies" },
  { key: "featured_management", label: "Featured Management" },
];

export default function Roles() {
  const { user } = useAuth();
  const [tab, setTab] = useState("roles");
  const [createOpen, setCreateOpen] = useState(false);
  const [newRolePermissions, setNewRolePermissions] = useState<Record<string, boolean>>({});

  // Get the creating user's own permissions — they can only assign permissions they have
  const creatorRole = user?.role ?? "public";
  const creatorPermissions = getPermissionsForRole(creatorRole as AppRole);
  
  // Filter available permissions to only what the creator has
  const availablePermissions = ALL_PERMISSIONS.filter(p => 
    creatorRole === "platform_owner" || creatorPermissions.includes(p.key as Permission)
  );

  const togglePermission = (key: string) => {
    // Only allow toggling permissions the creator has
    if (creatorRole !== "platform_owner" && !creatorPermissions.includes(key as Permission)) return;
    setNewRolePermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const permissionLabels: Record<string, string> = {
    dashboard: "Dashboard", students: "Students", tests: "Tests & Exams", progress: "Progress Reports",
    library: "Library", lectures: "Lectures", courses: "Courses", roles: "Roles & Permissions", settings: "Settings", billing: "Billing"
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description="Manage access control for your organization"
        actions={
          <Dialog open={createOpen} onOpenChange={(open) => { setCreateOpen(open); if (!open) setNewRolePermissions({}); }}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Create Role</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto">
              <DialogHeader><DialogTitle className="font-display">Create Custom Role</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-2">
                <div><Label>Role Name</Label><Input placeholder="e.g., Teaching Assistant" className="mt-1" /></div>
                <div><Label>Description</Label><Input placeholder="Brief description..." className="mt-1" /></div>
                
                {creatorRole !== "platform_owner" && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      You can only assign permissions that you have. Permissions you don't have are disabled.
                    </AlertDescription>
                  </Alert>
                )}
                
                <div>
                  <Label className="mb-3 block">Permissions</Label>
                  <div className="space-y-3">
                    {availablePermissions.map(({ key, label }) => {
                      const hasPermission = creatorRole === "platform_owner" || creatorPermissions.includes(key as Permission);
                      return (
                        <div key={key} className={`flex items-center justify-between ${!hasPermission ? 'opacity-40' : ''}`}>
                          <span className="text-sm">{label}</span>
                          <Switch 
                            checked={!!newRolePermissions[key]} 
                            onCheckedChange={() => togglePermission(key)}
                            disabled={!hasPermission}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <Button className="w-full" onClick={() => setCreateOpen(false)}>Create Role</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="roles"><Shield className="w-3.5 h-3.5 mr-1" />Roles</TabsTrigger>
          <TabsTrigger value="team"><Users className="w-3.5 h-3.5 mr-1" />Team Members</TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "roles" ? (
        <div className="space-y-4">
          {roles.map((role) => (
            <motion.div key={role.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold font-display">{role.name}</h3>
                      <StatusBadge variant={role.type === "system" ? "info" : "outline"}>{role.type}</StatusBadge>
                    </div>
                    <p className="text-xs text-muted-foreground">{role.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground mr-2 flex items-center gap-1"><Users className="w-3 h-3" /> {role.users}</span>
                  {role.type === "custom" && (
                    <>
                      <Button variant="ghost" size="sm"><Edit className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(role.permissions).map(([key, enabled]) => (
                  <span key={key} className={`px-2 py-1 rounded-md text-xs ${enabled ? 'bg-success/10 text-success' : 'bg-secondary text-muted-foreground line-through'}`}>
                    {permissionLabels[key]}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {teamMembers.map((m) => (
            <motion.div key={m.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-xl border border-border shadow-card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                {m.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.email}</p>
              </div>
              <StatusBadge variant={m.role === "Super Admin" ? "destructive" : m.role === "Admin" ? "default" : "outline"}>{m.role}</StatusBadge>
              <StatusBadge variant={m.status === "active" ? "success" : "warning"}>{m.status}</StatusBadge>
              <span className="text-xs text-muted-foreground hidden sm:block">{m.lastActive}</span>
              <Button variant="ghost" size="sm"><ChevronRight className="w-4 h-4" /></Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
