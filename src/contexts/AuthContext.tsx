// ============= Auth Context (Mock) =============
import { createContext, useContext, useState, ReactNode } from "react";
import type { AppRole, Permission } from "@/config/roles";
import { hasPermission, getEffectivePermissions } from "@/config/roles";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: AppRole;
  instituteId?: string;
  companyId?: string;
  consultancyId?: string;
  assignedInstructorId?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: AppRole) => void;
  can: (permission: Permission) => boolean;
  effectivePermissions: Permission[];
}

const MOCK_USERS: Record<AppRole, AuthUser> = {
  platform_owner: { id: "U001", name: "John Doe", email: "john@platform.com", role: "platform_owner" },
  institute_owner: { id: "U002", name: "Jane Smith", email: "jane@techverse.com", role: "institute_owner", instituteId: "1" },
  consultancy_owner: { id: "U008", name: "Ravi Kumar", email: "ravi@globalconsult.com", role: "consultancy_owner", consultancyId: "CON1" },
  instructor: { id: "U004", name: "Sarah Wilson", email: "sarah@techverse.com", role: "instructor", instituteId: "1" },
  student: { id: "U005", name: "Alice Johnson", email: "alice@email.com", role: "student", instituteId: "1", assignedInstructorId: "U004" },
  company: { id: "U006", name: "TechCorp HR", email: "hr@techcorp.com", role: "company", companyId: "C001" },
  public: { id: "U007", name: "Guest User", email: "guest@email.com", role: "public" },
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (email: string, _password: string): Promise<boolean> => {
    const found = Object.values(MOCK_USERS).find((u) => u.email === email);
    if (found) { setUser(found); return true; }
    return false;
  };

  const logout = () => setUser(null);

  const switchRole = (role: AppRole) => {
    setUser(MOCK_USERS[role]);
  };

  const can = (permission: Permission): boolean => {
    if (!user) return false;
    return hasPermission(user.role, permission, user.instituteId, user.assignedInstructorId, user.id);
  };

  const effectivePermissions: Permission[] = user
    ? getEffectivePermissions(user.role, user.instituteId, user.assignedInstructorId, user.id)
    : [];

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, switchRole, can, effectivePermissions }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
