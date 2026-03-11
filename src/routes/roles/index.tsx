import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Shield, Plus, Users, Edit, Trash2, ChevronRight, Building2, Globe, Briefcase, Layers } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRoles, useRolesByCategory, useTeamMembers, useTeamMembersByCategory, useCreateRole, useUpdateRole, useDeleteRole } from "@/hooks/useRoles";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { z } from "zod";
import { ReusableForm, FormInput, FormSwitch } from "@/components/forms";
import { PERMISSION_LABELS } from "@/types";
import type { Role } from "@/types";
import { canCreateRoles, canViewRole, canEditRole } from "@/config/roles";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { RoleCategory } from "@/services/roles";

const INSTITUTE_PERMISSION_KEYS = ["dashboard", "students", "tests", "progress", "library", "lectures", "courses", "roles", "settings", "billing", "placements", "fees", "attendance", "announcements", "enrollment"];
const CONSULTANCY_PERMISSION_KEYS = ["dashboard", "visa_tracking", "university_applications", "language_courses", "counselor_management", "consultancy_manage", "roles", "settings", "billing", "announcements", "students"];
const COMPANY_PERMISSION_KEYS = ["dashboard", "company_vacancies", "placements", "roles", "settings"];

const roleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().min(1, "Description is required"),
  dashboard: z.boolean().default(false),
  students: z.boolean().default(false),
  tests: z.boolean().default(false),
  progress: z.boolean().default(false),
  library: z.boolean().default(false),
  lectures: z.boolean().default(false),
  courses: z.boolean().default(false),
  roles: z.boolean().default(false),
  settings: z.boolean().default(false),
  billing: z.boolean().default(false),
  placements: z.boolean().default(false),
  fees: z.boolean().default(false),
  attendance: z.boolean().default(false),
  announcements: z.boolean().default(false),
  enrollment: z.boolean().default(false),
  visa_tracking: z.boolean().default(false),
  university_applications: z.boolean().default(false),
  language_courses: z.boolean().default(false),
  counselor_management: z.boolean().default(false),
  consultancy_manage: z.boolean().default(false),
  company_vacancies: z.boolean().default(false),
});

type RoleFormValues = z.infer<typeof roleSchema>;

const ROLE_NAME_TO_APP_ROLE: Record<string, string> = {
  "Super Admin": "platform_owner",
  "Institute Owner": "institute_owner",
  "Consultancy Owner": "consultancy_owner",
  "Admin": "admin",
  "Instructor": "instructor",
  "Student": "student",
  "Company": "company",
};

function getEntityBadge(roleId: string): string | null {
  if (roleId.startsWith("CR")) return "Consultancy";
  if (roleId.startsWith("COR")) return "Company";
  if (roleId.startsWith("R")) return "Institute";
  return null;
}

function RoleCard({ role, editable, onEdit, onDelete, showEntityBadge }: { role: Role; editable: boolean; onEdit: (r: Role) => void; onDelete: (id: string) => void; showEntityBadge?: boolean }) {
  const entityBadge = showEntityBadge ? getEntityBadge(role.id) : null;
  return (
    <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold font-display">{role.name}</h3>
              <StatusBadge variant={role.type === "system" ? "info" : "outline"}>{role.type}</StatusBadge>
              <StatusBadge variant={role.scope === "global" ? "destructive" : "default"}>{role.scope}</StatusBadge>
              {entityBadge && <StatusBadge variant="info">{entityBadge}</StatusBadge>}
              {!editable && <StatusBadge variant="outline">Read-only</StatusBadge>}
            </div>
            <p className="text-xs text-muted-foreground">{role.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground mr-2 flex items-center gap-1"><Users className="w-3 h-3" /> {role.users}</span>
          {editable && (
            <>
              <Button variant="ghost" size="sm" onClick={() => onEdit(role)}><Edit className="w-3.5 h-3.5" /></Button>
              {role.type === "custom" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Role</AlertDialogTitle>
                      <AlertDialogDescription>Are you sure you want to delete "{role.name}"?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(role.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(role.permissions).map(([key, enabled]) => (
          <span key={key} className={`px-2 py-0.5 rounded-md text-[11px] ${enabled ? "bg-success/10 text-success" : "bg-secondary text-muted-foreground line-through"}`}>
            {PERMISSION_LABELS[key] || key}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function RolesPage() {
  const { currentInstitute } = useApp();
  const { user } = useAuth();
  const isPlatformOwner = user?.role === "platform_owner";
  const isConsultancyOwner = user?.role === "consultancy_owner";

  const [tab, setTab] = useState("roles");
  const [entityTab, setEntityTab] = useState<RoleCategory>(
    isPlatformOwner ? "all" : isConsultancyOwner ? "consultancy" : "institute"
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const userCanCreateRoles = user ? canCreateRoles(user.role) : false;
  const userRole = user?.role ?? "public";

  const { data: instituteRoles, isLoading: rolesLoading } = useRoles(currentInstitute.id);
  const { data: categoryRoles, isLoading: catLoading } = useRolesByCategory(entityTab);
  const { data: teamMembers, isLoading: teamLoading } = useTeamMembers(currentInstitute.id);
  const { data: categoryTeam, isLoading: catTeamLoading } = useTeamMembersByCategory(entityTab);
  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const deleteMutation = useDeleteRole();

  const getActiveRoles = () => {
    if (isPlatformOwner) return categoryRoles ?? [];
    if (isConsultancyOwner) return categoryRoles ?? [];
    return instituteRoles ?? [];
  };

  const getActiveTeam = () => {
    if (isPlatformOwner || isConsultancyOwner) return categoryTeam ?? [];
    return teamMembers ?? [];
  };

  const getActivePermissionKeys = () => {
    if (entityTab === "all") return [...new Set([...INSTITUTE_PERMISSION_KEYS, ...CONSULTANCY_PERMISSION_KEYS, ...COMPANY_PERMISSION_KEYS])];
    if (entityTab === "consultancy") return CONSULTANCY_PERMISSION_KEYS;
    if (entityTab === "company") return COMPANY_PERMISSION_KEYS;
    return INSTITUTE_PERMISSION_KEYS;
  };

  const activeRoles = getActiveRoles();
  const activeTeam = getActiveTeam();
  const activePermissionKeys = getActivePermissionKeys();

  const visibleRoles = activeRoles.filter((role) => {
    if (userRole === "platform_owner") return true;
    const appRoleKey = ROLE_NAME_TO_APP_ROLE[role.name];
    if (!appRoleKey) return true;
    return canViewRole(userRole, appRoleKey as any);
  });

  const canEditThisRole = (role: Role): boolean => {
    if (userRole === "platform_owner") return true;
    if (userRole === "consultancy_owner") return role.type === "custom" || role.scope !== "global";
    const appRoleKey = ROLE_NAME_TO_APP_ROLE[role.name];
    if (!appRoleKey) return role.type === "custom" && userCanCreateRoles;
    return canEditRole(userRole, appRoleKey as any);
  };

  const handleCreate = async (values: RoleFormValues) => {
    const { name, description, ...perms } = values;
    try {
      await createMutation.mutateAsync({
        name, description, users: 0, type: "custom", permissions: perms,
        instituteId: currentInstitute.id,
        scope: user?.role === "platform_owner" ? "global" : "institute",
        createdBy: user?.role,
      });
      toast.success("Role created successfully");
      setCreateOpen(false);
    } catch { toast.error("Failed to create role"); }
  };

  const handleEdit = async (values: RoleFormValues) => {
    if (!editRole) return;
    const { name, description, ...perms } = values;
    try {
      await updateMutation.mutateAsync({ id: editRole.id, data: { name, description, permissions: perms } });
      toast.success("Role updated successfully");
      setEditRole(null);
    } catch { toast.error("Failed to update role"); }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Role deleted successfully");
    } catch (e: any) { toast.error(e.message || "Failed to delete role"); }
  };

  const roleToFormValues = (role: Role): RoleFormValues => ({
    name: role.name, description: role.description,
    ...Object.fromEntries(Object.keys(roleSchema.shape).filter(k => k !== "name" && k !== "description").map((k) => [k, role.permissions[k] ?? false])),
  } as RoleFormValues);

  const isLoading = (isPlatformOwner || isConsultancyOwner) ? catLoading : rolesLoading;
  const isTeamLoading = (isPlatformOwner || isConsultancyOwner) ? catTeamLoading : teamLoading;

  const showEntityTabs = isPlatformOwner || isConsultancyOwner;

  const getDescription = () => {
    if (isPlatformOwner) {
      if (entityTab === "all") return "Global view — all roles across institutes, consultancies, and companies";
      return `Manage ${entityTab} default roles & permissions`;
    }
    if (isConsultancyOwner) return "Manage consultancy roles and permissions";
    if (userRole === "institute_owner") return "Manage roles within your institute";
    return "View roles and permissions";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description={getDescription()}
        actions={
          userCanCreateRoles ? (
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Create Role</Button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader><DialogTitle className="font-display">Create Custom Role</DialogTitle></DialogHeader>
                <ReusableForm schema={roleSchema} defaultValues={Object.fromEntries(Object.keys(roleSchema.shape).map(k => [k, k === "name" || k === "description" ? "" : false])) as any} onSubmit={handleCreate} submitLabel="Create Role" isLoading={createMutation.isPending}>
                  {(form) => (
                    <>
                      <FormInput form={form} name="name" label="Role Name" placeholder="e.g., Teaching Assistant" />
                      <FormInput form={form} name="description" label="Description" placeholder="Brief description..." />
                      <div className="space-y-3 pt-2">
                        <p className="text-xs font-medium">Permissions</p>
                        {activePermissionKeys.map((key) => (
                          <FormSwitch key={key} form={form} name={key as any} label={PERMISSION_LABELS[key] || key} />
                        ))}
                      </div>
                    </>
                  )}
                </ReusableForm>
              </DialogContent>
            </Dialog>
          ) : undefined
        }
      />

      <Dialog open={!!editRole} onOpenChange={(open) => !open && setEditRole(null)}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display">Edit Role: {editRole?.name}</DialogTitle></DialogHeader>
          {editRole && (
            <ReusableForm schema={roleSchema} defaultValues={roleToFormValues(editRole)} onSubmit={handleEdit} submitLabel="Save Changes" isLoading={updateMutation.isPending}>
              {(form) => (
                <>
                  <FormInput form={form} name="name" label="Role Name" />
                  <FormInput form={form} name="description" label="Description" />
                  <div className="space-y-3 pt-2">
                    <p className="text-xs font-medium">Permissions</p>
                    {activePermissionKeys.map((key) => (
                      <FormSwitch key={key} form={form} name={key as any} label={PERMISSION_LABELS[key] || key} />
                    ))}
                  </div>
                </>
              )}
            </ReusableForm>
          )}
        </DialogContent>
      </Dialog>

      {/* Entity type tabs */}
      {showEntityTabs && (
        <Tabs value={entityTab} onValueChange={(v) => setEntityTab(v as RoleCategory)}>
          <TabsList>
            {isPlatformOwner && <TabsTrigger value="all"><Layers className="w-3.5 h-3.5 mr-1" />All</TabsTrigger>}
            {isPlatformOwner && <TabsTrigger value="institute"><Building2 className="w-3.5 h-3.5 mr-1" />Institute</TabsTrigger>}
            <TabsTrigger value="consultancy"><Globe className="w-3.5 h-3.5 mr-1" />Consultancy</TabsTrigger>
            {isPlatformOwner && <TabsTrigger value="company"><Briefcase className="w-3.5 h-3.5 mr-1" />Company</TabsTrigger>}
          </TabsList>
        </Tabs>
      )}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="roles"><Shield className="w-3.5 h-3.5 mr-1" />Roles</TabsTrigger>
          <TabsTrigger value="team"><Users className="w-3.5 h-3.5 mr-1" />Team Members</TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "roles" ? (
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
          ) : visibleRoles.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">No roles available for your permission level</div>
          ) : (
            visibleRoles.map((role) => (
              <RoleCard key={role.id} role={role} editable={canEditThisRole(role)} onEdit={setEditRole} onDelete={handleDelete} showEntityBadge={entityTab === "all"} />
            ))
          )}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {isTeamLoading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)
            ) : (
              activeTeam?.map((m) => (
                <motion.div key={m.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-xl border border-border shadow-card p-4 flex items-center gap-4 cursor-pointer hover:bg-secondary/30 transition-colors" onClick={() => setSelectedMember(m)}>
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                    {m.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.email}</p>
                  </div>
                  <StatusBadge variant={m.role === "Super Admin" || m.role === "Consultancy Owner" || m.role === "Company Admin" ? "destructive" : m.role === "Admin" || m.role === "HR Manager" ? "default" : "outline"}>{m.role}</StatusBadge>
                  <StatusBadge variant={m.status === "active" ? "success" : "warning"}>{m.status}</StatusBadge>
                  <span className="text-xs text-muted-foreground hidden sm:block">{m.lastActive}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              ))
            )}
          </div>

          <Sheet open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="font-display">Team Member Details</SheetTitle>
              </SheetHeader>
              {selectedMember && (
                <div className="space-y-6 mt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xl font-bold">
                      {selectedMember.name.split(" ").map((n: string) => n[0]).join("")}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedMember.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedMember.email}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Role</span>
                      <StatusBadge variant={selectedMember.role === "Super Admin" ? "destructive" : "default"}>{selectedMember.role}</StatusBadge>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <StatusBadge variant={selectedMember.status === "active" ? "success" : "warning"}>{selectedMember.status}</StatusBadge>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Last Active</span>
                      <span className="text-sm">{selectedMember.lastActive}</span>
                    </div>
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </>
      )}
    </div>
  );
}
