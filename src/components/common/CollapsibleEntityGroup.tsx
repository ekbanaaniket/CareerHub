// ============= Collapsible Entity Group for Platform Owner =============
import { useState } from "react";
import { Building2, ChevronDown, ChevronRight, Globe, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CollapsibleEntityGroupProps {
  entityName: string;
  entityType?: "institute" | "consultancy" | "company";
  count: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const entityIcons = {
  institute: Building2,
  consultancy: Globe,
  company: Briefcase,
};

export function CollapsibleEntityGroup({
  entityName,
  entityType = "institute",
  count,
  defaultOpen = true,
  children,
}: CollapsibleEntityGroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  const Icon = entityIcons[entityType];

  return (
    <div className="space-y-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 group cursor-pointer w-full"
      >
        <div className={cn(
          "w-6 h-6 rounded-md flex items-center justify-center transition-colors",
          open ? "bg-primary/10" : "bg-secondary"
        )}>
          {open ? (
            <ChevronDown className="w-3.5 h-3.5 text-primary" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </div>
        <Icon className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold font-display text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors">
          {entityName}
        </h3>
        <span className="text-xs font-normal text-muted-foreground">
          ({count})
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============= Show More / Paginated List =============
interface ShowMoreListProps<T> {
  items: T[];
  initialCount?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export function ShowMoreList<T>({
  items,
  initialCount = 6,
  renderItem,
  className,
}: ShowMoreListProps<T>) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? items : items.slice(0, initialCount);
  const hasMore = items.length > initialCount;

  return (
    <div className="space-y-3">
      <div className={className}>
        {displayed.map((item, i) => renderItem(item, i))}
      </div>
      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {showAll
              ? "Show Less"
              : `Show ${items.length - initialCount} more`}
          </Button>
        </div>
      )}
    </div>
  );
}
