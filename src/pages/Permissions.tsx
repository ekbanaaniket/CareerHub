// ============= Hierarchical Permission Management Page =============
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useAuth } from "@/contexts/AuthContext";
import {
  Shield, Search, ShieldOff, ShieldCheck, History, User, AlertTriangle,
  Building2, Globe, Briefcase, ChevronRight, ArrowLeft, Users, Loader2,
} from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { PERMISSION_LABELS } from "@/types";
import {
  fetchEntitySummaries, fetchUserPermissions, fetchRevocationHistory,
  revokePermission, restorePermission, revokeAllPermissions, grantPermission,
  type UserPermission, type PermissionRevocation, type EntitySummary,
} from "@/services/permissions";

type DrilldownLevel = "entity-type" | "entity-list" | "users";

interface DrilldownState {
  level: DrilldownLevel;
  entityType?: "institute" | "consultancy" | "company";
  entityId?: string;
  entityName?: string;
}

export default function PermissionsPage() {
  const { user } = useAuth();
  const isPlatformOwner = user?.role === "platform_owner";
  const isOwnerRole = ["platform_owner", "institute_owner", "consultancy_owner", "company"].includes(user?.role ?? "");

  // Drilldown state
  const [drilldown, setDrilldown] = useState<DrilldownState>(() => {
    // Non-platform owners go directly to their entity's users
    if (!isPlatformOwner && user) {
      const entityType = user.role === "institute_owner" || user.role === "instructor"
        ? "institute" as const
        : user.role === "consultancy_owner"
        ? "consultancy" as const
        : user.role === "company"
        ? "company" as const
        : "institute" as const;
      const entityId = user.instituteId ?? user.consultancyId ?? user.companyId;
      return { level: "users", entityType, entityId };
    }
    return { level: "entity-type" };
  });

  const [entitySummaries, setEntitySummaries] = useState<EntitySummary[]>([]);
  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  const [history, setHistory] = useState<PermissionRevocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Revoke dialog state
  const [revokeOpen, setRevokeOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserPermission | null>(null);
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [revokeReason, setRevokeReason] = useState("");
  const [revokeAllOpen, setRevokeAllOpen] = useState(false);

  const viewerEntityId = useMemo(() => {
    if (user?.role === "institute_owner" || user?.role === "instructor") return user.instituteId;
    if (user?.role === "consultancy_owner") return user.consultancyId;
    if (user?.role === "company") return user.companyId;
    return undefined;
  }, [user]);

  const loadEntitySummaries = useCallback(async (type: "institute" | "consultancy" | "company") => {
    setLoading(true);
    const res = await fetchEntitySummaries(type, user?.role ?? "public", viewerEntityId);
    setEntitySummaries(res.data);
    setLoading(false);
  }, [user?.role, viewerEntityId]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const [permRes, histRes] = await Promise.all([
      fetchUserPermissions({
        search,
        status: statusFilter,
        entityType: drilldown.entityType,
        entityId: drilldown.entityId,
        viewerRole: user?.role,
        viewerEntityId,
      }),
      fetchRevocationHistory({
        search,
        entityType: drilldown.entityType,
        entityId: drilldown.entityId,
      }),
    ]);
    setPermissions(permRes.data);
    setHistory(histRes.data);
    setLoading(false);
  }, [search, statusFilter, drilldown, user?.role, viewerEntityId]);

  useEffect(() => {
    if (drilldown.level === "entity-list" && drilldown.entityType) {
      loadEntitySummaries(drilldown.entityType);
    } else if (drilldown.level === "users") {
      loadUsers();
    }
  }, [drilldown, loadEntitySummaries, loadUsers]);

  const navigateToEntityType = (type: "institute" | "consultancy" | "company") => {
    setSearch("");
    setStatusFilter("all");
    setDrilldown({ level: "entity-list", entityType: type });
  };

  const navigateToEntity = (entityId: string, entityName: string) => {
    setSearch("");
    setStatusFilter("all");
    setDrilldown({ level: "users", entityType: drilldown.entityType, entityId, entityName });
  };

  const goBack = () => {
    if (drilldown.level === "users" && isPlatformOwner) {
      setDrilldown({ level: "entity-list", entityType: drilldown.entityType });
    } else if (drilldown.level === "entity-list") {
      setDrilldown({ level: "entity-type" });
    }
  };

  const openRevokeDialog = (up: UserPermission) => {
    setSelectedUser(up);
    setSelectedPerms([]);
    setRevokeReason("");
    setRevokeOpen(true);
  };

  const handleRevokeSelected = async () => {
    if (!selectedUser || !user || selectedPerms.length === 0) return;
    for (const perm of selectedPerms) {
      await revokePermission(
        selectedUser.userId, perm, user.id, user.name, user.role,
        selectedUser.entityType, selectedUser.entityId, selectedUser.entityName,
        revokeReason
      );
    }
    toast({ title: "Permissions revoked", description: `${selectedPerms.length} permission(s) revoked from ${selectedUser.userName}` });
    setRevokeOpen(false);
    loadUsers();
  };

  const handleRevokeAll = async () => {
    if (!selectedUser || !user) return;
    await revokeAllPermissions(
      selectedUser.userId, user.id, user.name, user.role,
      selectedUser.entityType, selectedUser.entityId, selectedUser.entityName,
      revokeReason
    );
    toast({ title: "All permissions revoked", description: `All permissions revoked from ${selectedUser.userName}` });
    setRevokeAllOpen(false);
    setRevokeOpen(false);
    loadUsers();
  };

  const handleRestore = async (up: UserPermission, perm: string) => {
    await restorePermission(up.userId, perm, up.entityId);
    toast({ title: "Permission restored", description: `${PERMISSION_LABELS[perm] ?? perm} restored for ${up.userName}` });
    loadUsers();
  };

  const handleGrant = async (up: UserPermission, perm: string) => {
    await grantPermission(up.userId, perm, up.entityId);
    toast({ title: "Permission granted", description: `${PERMISSION_LABELS[perm] ?? perm} granted to ${up.userName}` });
    loadUsers();
  };

  const statusVariant = (s: string) => {
    switch (s) { case "active": return "success" as const; case "partially_revoked": return "warning" as const; default: return "destructive" as const; }
  };

  const entityTypeConfig = {
    institute: { label: "Institutes", icon: Building2, color: "text-primary bg-primary/10" },
    consultancy: { label: "Consultancies", icon: Globe, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30" },
    company: { label: "Companies", icon: Briefcase, color: "text-amber-600 bg-amber-50 dark:bg-amber-900/30" },
  };

  // Breadcrumb
  const breadcrumb = useMemo(() => {
    const parts: { label: string; onClick?: () => void }[] = [
      { label: "Permissions", onClick: isPlatformOwner ? () => setDrilldown({ level: "entity-type" }) : undefined },
    ];
    if (drilldown.entityType) {
      parts.push({
        label: entityTypeConfig[drilldown.entityType].label,
        onClick: isPlatformOwner ? () => setDrilldown({ level: "entity-list", entityType: drilldown.entityType }) : undefined,
      });
    }
    if (drilldown.entityName) {
      parts.push({ label: drilldown.entityName });
    }
    return parts;
  }, [drilldown, isPlatformOwner]);

  // Group users by role for display
  const groupedByRole = useMemo(() => {
    const groups: Record<string, UserPermission[]> = {};
    for (const p of permissions) {
      const key = p.userRole;
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    }
    return groups;
  }, [permissions]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Permission Management"
        description="Manage user permissions across your organization hierarchy"
        actions={
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-4 h-4" />
            Higher roles can manage lower role permissions
          </div>
        }
      />

      {/* Breadcrumb navigation */}
      {(drilldown.level !== "entity-type" || !isPlatformOwner) && (
        <div className="flex items-center gap-1 text-sm">
          {isPlatformOwner && drilldown.level !== "entity-type" && (
            <Button variant="ghost" size="sm" onClick={goBack} className="gap-1 text-muted-foreground">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          )}
          {breadcrumb.map((part, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="w-3 h-3 text-muted-foreground" />}
              {part.onClick ? (
                <button onClick={part.onClick} className="text-primary hover:underline font-medium">{part.label}</button>
              ) : (
                <span className="font-medium text-foreground">{part.label}</span>
              )}
            </span>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Level 1: Choose entity type (Platform Owner only) */}
        {drilldown.level === "entity-type" && isPlatformOwner && (
          <motion.div key="entity-type" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(["institute", "consultancy", "company"] as const).map((type) => {
                const cfg = entityTypeConfig[type];
                const Icon = cfg.icon;
                return (
                  <button
                    key={type}
                    onClick={() => navigateToEntityType(type)}
                    className="bg-card rounded-xl border border-border shadow-card p-6 hover:shadow-elevated transition-all text-left group"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cfg.color} mb-4`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-semibold font-display mb-1">{cfg.label}</h3>
                    <p className="text-sm text-muted-foreground">Manage permissions for all {cfg.label.toLowerCase()}</p>
                    <ChevronRight className="w-5 h-5 text-muted-foreground mt-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Level 2: Entity list */}
        {drilldown.level === "entity-list" && (
          <motion.div key="entity-list" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : entitySummaries.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">No {drilldown.entityType === "institute" ? "institutes" : drilldown.entityType === "consultancy" ? "consultancies" : "companies"} found</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {entitySummaries.map((entity) => {
                  const cfg = entityTypeConfig[entity.type];
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={entity.id}
                      onClick={() => navigateToEntity(entity.id, entity.name)}
                      className="bg-card rounded-xl border border-border shadow-card p-5 hover:shadow-elevated transition-all text-left group"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${cfg.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold font-display truncate">{entity.name}</h4>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {entity.userCount} users</span>
                        {entity.revokedCount > 0 && (
                          <span className="flex items-center gap-1 text-destructive"><ShieldOff className="w-3 h-3" /> {entity.revokedCount} revoked</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Level 3: User permissions */}
        {drilldown.level === "users" && (
          <motion.div key="users" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <Tabs defaultValue="users">
              <TabsList>
                <TabsTrigger value="users"><User className="w-3.5 h-3.5 mr-1" /> User Permissions</TabsTrigger>
                <TabsTrigger value="history"><History className="w-3.5 h-3.5 mr-1" /> Revocation History</TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="space-y-4 mt-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search users..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="partially_revoked">Partially Revoked</SelectItem>
                      <SelectItem value="fully_revoked">Fully Revoked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  Object.entries(groupedByRole).map(([role, users]) => (
                    <div key={role} className="space-y-2">
                      <h3 className="text-xs font-semibold font-display flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                        <StatusBadge variant="outline">{role.replace("_", " ")}</StatusBadge>
                        <span>({users.length} users)</span>
                      </h3>
                      <DataTable headers={["User", "Role", "Active", "Revoked", "Status", "Actions"]}>
                        {users.map((up) => {
                          const activeCount = up.permissions.length - up.revokedPermissions.length;
                          return (
                            <tr key={up.id} className="hover:bg-secondary/30 transition-colors">
                              <td className="px-4 py-3">
                                <div>
                                  <p className="text-sm font-medium">{up.userName}</p>
                                  <p className="text-xs text-muted-foreground">{up.userEmail}</p>
                                </div>
                              </td>
                              <td className="px-4 py-3"><StatusBadge variant="outline">{up.userRole.replace("_", " ")}</StatusBadge></td>
                              <td className="px-4 py-3 text-sm font-medium">{activeCount}/{up.permissions.length}</td>
                              <td className="px-4 py-3">
                                {up.revokedPermissions.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {up.revokedPermissions.map((p) => (
                                      <span key={p} className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-destructive/10 text-destructive text-[10px]">
                                        <ShieldOff className="w-2.5 h-2.5" />{PERMISSION_LABELS[p] ?? p}
                                        {isOwnerRole && (
                                          <button className="ml-0.5 hover:text-foreground" onClick={() => handleRestore(up, p)} title="Restore">↩</button>
                                        )}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-xs text-muted-foreground">None</span>
                                )}
                              </td>
                              <td className="px-4 py-3"><StatusBadge variant={statusVariant(up.status)}>{up.status.replace(/_/g, " ")}</StatusBadge></td>
                              <td className="px-4 py-3">
                                {isOwnerRole && (
                                  <Button variant="outline" size="sm" onClick={() => openRevokeDialog(up)} disabled={up.status === "fully_revoked"}>
                                    <ShieldOff className="w-3.5 h-3.5 mr-1" /> Manage
                                  </Button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </DataTable>
                    </div>
                  ))
                )}

                {!loading && permissions.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground text-sm">No user permissions found for this {drilldown.entityType ?? "entity"}</div>
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-4 mt-4">
                <DataTable headers={["User", "Permission", "Revoked By", "Entity", "Reason", "Date"]}>
                  {history.map((rev) => (
                    <tr key={rev.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium">{rev.userName}</td>
                      <td className="px-4 py-3"><StatusBadge variant="destructive">{PERMISSION_LABELS[rev.permission] ?? rev.permission}</StatusBadge></td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm">{rev.revokedByName}</p>
                          <p className="text-xs text-muted-foreground">{rev.revokedByRole.replace("_", " ")}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{rev.entityName}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground max-w-48 truncate">{rev.reason ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{rev.revokedAt}</td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground text-sm">No revocation history</td></tr>
                  )}
                </DataTable>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Revoke Permissions Dialog */}
      <Dialog open={revokeOpen} onOpenChange={setRevokeOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <ShieldOff className="w-5 h-5 text-destructive" />
              Manage Permissions — {selectedUser?.userName}
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 mt-2">
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-sm font-medium">{selectedUser.userName}</p>
                <p className="text-xs text-muted-foreground">{selectedUser.userEmail} • {selectedUser.userRole.replace("_", " ")} at {selectedUser.entityName}</p>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Active permissions — select to revoke:</Label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {selectedUser.permissions
                    .filter((p) => !selectedUser.revokedPermissions.includes(p))
                    .map((perm) => (
                      <label key={perm} className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer">
                        <Checkbox
                          checked={selectedPerms.includes(perm)}
                          onCheckedChange={(checked) => {
                            setSelectedPerms((prev) =>
                              checked ? [...prev, perm] : prev.filter((p) => p !== perm)
                            );
                          }}
                        />
                        <span className="text-sm">{PERMISSION_LABELS[perm] ?? perm}</span>
                      </label>
                    ))}
                </div>
              </div>

              {selectedUser.revokedPermissions.length > 0 && (
                <div>
                  <Label className="text-sm font-medium mb-2 block text-muted-foreground">Revoked permissions — click to restore:</Label>
                  <div className="flex flex-wrap gap-1">
                    {selectedUser.revokedPermissions.map((perm) => (
                      <button
                        key={perm}
                        onClick={() => handleRestore(selectedUser, perm)}
                        className="flex items-center gap-1 px-2 py-1 rounded-md bg-destructive/10 text-destructive text-xs hover:bg-destructive/20 transition-colors"
                      >
                        <ShieldOff className="w-3 h-3" />
                        {PERMISSION_LABELS[perm] ?? perm}
                        <ShieldCheck className="w-3 h-3 ml-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label>Reason (optional)</Label>
                <Textarea className="mt-1" placeholder="Why are you revoking these permissions?" value={revokeReason} onChange={(e) => setRevokeReason(e.target.value)} />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" variant="destructive" onClick={handleRevokeSelected} disabled={selectedPerms.length === 0}>
                  <ShieldOff className="w-4 h-4 mr-1" /> Revoke Selected ({selectedPerms.length})
                </Button>
                <Button variant="outline" onClick={() => { setRevokeAllOpen(true); }}>
                  <AlertTriangle className="w-4 h-4 mr-1" /> Revoke All
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={revokeAllOpen}
        onOpenChange={setRevokeAllOpen}
        title="Revoke All Permissions"
        description={`This will revoke ALL permissions from ${selectedUser?.userName}. They will lose all access to ${selectedUser?.entityName}. This action can be reversed individually.`}
        onConfirm={handleRevokeAll}
        variant="destructive"
      />
    </div>
  );
}
