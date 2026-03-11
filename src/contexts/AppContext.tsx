import { useState, createContext, useContext, ReactNode, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface Organization {
  id: string;
  name: string;
  logo: string;
  role: string;
  type: "institute" | "consultancy" | "company";
}

interface AppContextType {
  currentInstitute: Organization;
  setCurrentInstitute: (inst: Organization) => void;
  institutes: Organization[];
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const ALL_ORGANIZATIONS: Organization[] = [
  { id: "1", name: "TechVerse Academy", logo: "TV", role: "Owner", type: "institute" },
  { id: "2", name: "CodeCraft Institute", logo: "CC", role: "Manager", type: "institute" },
  { id: "3", name: "DigitalMinds School", logo: "DM", role: "Instructor", type: "institute" },
  { id: "CON1", name: "Global Consultancy", logo: "GC", role: "Owner", type: "consultancy" },
  { id: "C001", name: "TechCorp", logo: "TC", role: "HR Manager", type: "company" },
];

// Determine which organizations each role can see
function getOrgsForRole(role?: string, instituteId?: string, consultancyId?: string, companyId?: string): Organization[] {
  if (role === "platform_owner") return ALL_ORGANIZATIONS;
  if (role === "institute_owner") return ALL_ORGANIZATIONS.filter((o) => o.id === instituteId);
  if (role === "consultancy_owner") return ALL_ORGANIZATIONS.filter((o) => o.id === consultancyId);
  if (role === "company") return ALL_ORGANIZATIONS.filter((o) => o.id === companyId);
  if (role === "instructor" || role === "student") {
    return ALL_ORGANIZATIONS.filter((o) => o.id === instituteId);
  }
  return [ALL_ORGANIZATIONS[0]];
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const orgs = useMemo(() => {
    return getOrgsForRole(
      user?.role,
      user?.instituteId,
      (user as any)?.consultancyId,
      (user as any)?.companyId,
    );
  }, [user?.role, user?.instituteId, (user as any)?.consultancyId, (user as any)?.companyId]);

  const [currentInstitute, setCurrentInstitute] = useState(orgs[0] ?? ALL_ORGANIZATIONS[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // If user role changes and the selected org isn't in the list, reset
  const effectiveOrg = orgs.find((o) => o.id === currentInstitute.id) ?? orgs[0] ?? ALL_ORGANIZATIONS[0];

  return (
    <AppContext.Provider
      value={{
        currentInstitute: effectiveOrg,
        setCurrentInstitute,
        institutes: orgs,
        sidebarOpen,
        setSidebarOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
