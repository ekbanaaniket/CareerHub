// ============= Entity Group Filter for Platform Owner =============
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Globe, Briefcase } from "lucide-react";

export interface EntityOption {
  id: string;
  name: string;
}

interface EntityGroupFilterProps {
  label: string;
  entities: EntityOption[];
  selected: string;
  onSelect: (id: string) => void;
  icon?: "institute" | "consultancy" | "company";
}

const icons = {
  institute: Building2,
  consultancy: Globe,
  company: Briefcase,
};

export function EntityGroupFilter({ label, entities, selected, onSelect, icon = "institute" }: EntityGroupFilterProps) {
  const Icon = icons[icon];
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <Select value={selected} onValueChange={onSelect}>
        <SelectTrigger className="w-52">
          <SelectValue placeholder={`All ${label}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All {label}</SelectItem>
          {entities.map(e => (
            <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// Mock data for platform owner entity filtering
export const MOCK_INSTITUTES: EntityOption[] = [
  { id: "1", name: "TechVerse Academy" },
  { id: "2", name: "CodeMaster Institute" },
  { id: "3", name: "Digital Skills Hub" },
  { id: "4", name: "FutureStack University" },
  { id: "5", name: "ByteForge Academy" },
];

export const MOCK_CONSULTANCIES: EntityOption[] = [
  { id: "CON1", name: "Global Education Consultancy" },
  { id: "CON2", name: "StudyAbroad Pro" },
  { id: "CON3", name: "Pathway Advisors" },
  { id: "CON4", name: "EduBridge International" },
];

export const MOCK_COMPANIES: EntityOption[] = [
  { id: "C001", name: "Google" },
  { id: "C002", name: "Microsoft" },
  { id: "C003", name: "Stripe" },
  { id: "C004", name: "Amazon" },
  { id: "C005", name: "Netflix" },
  { id: "C006", name: "Meta" },
  { id: "C007", name: "Spotify" },
  { id: "C008", name: "Airbnb" },
];
