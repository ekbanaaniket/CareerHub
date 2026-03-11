// ============= Role Switcher (Demo) =============
import { useAuth } from "@/contexts/AuthContext";
import { ROLE_CONFIGS, type AppRole } from "@/config/roles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function RoleSwitcher() {
  const { user, switchRole } = useAuth();
  if (!user) return null;

  return (
    <div className="px-3 py-2">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 px-1">Demo: Switch Role</p>
      <Select value={user.role} onValueChange={(val) => switchRole(val as AppRole)}>
        <SelectTrigger className="h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.values(ROLE_CONFIGS).map((role) => (
            <SelectItem key={role.id} value={role.id} className="text-xs">
              {role.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
