// ============= Reusable Entity Group Card =============
// A collapsible card that groups data by entity (institute/consultancy/company)
// with lazy loading support via infinite scroll sentinel
import { useState, useCallback } from "react";
import { Building2, Globe, Briefcase, ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import * as Collapsible from "@radix-ui/react-collapsible";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Types ───

export interface EntityGroupInfo {
  id: string;
  name: string;
  type: "institute" | "consultancy" | "company";
  logo: string;
  subtitle?: string; // e.g. location, industry
  status?: string;
  meta?: { label: string; value: string | number }[];
}

interface EntityGroupCardProps {
  entity: EntityGroupInfo;
  defaultOpen?: boolean;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

const ENTITY_ICONS = {
  institute: Building2,
  consultancy: Globe,
  company: Briefcase,
};

const ENTITY_COLORS = {
  institute: "bg-primary/10 text-primary border-primary/20",
  consultancy: "bg-warning/10 text-warning border-warning/20",
  company: "bg-success/10 text-success border-success/20",
};

export function EntityGroupCard({
  entity,
  defaultOpen = true,
  children,
  actions,
  className,
}: EntityGroupCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const Icon = ENTITY_ICONS[entity.type];
  const colorClass = ENTITY_COLORS[entity.type];

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className={cn("rounded-xl border border-border bg-card shadow-card overflow-hidden", className)}>
      <Collapsible.Trigger asChild>
        <button className="w-full flex items-center gap-3 p-4 hover:bg-secondary/30 transition-colors cursor-pointer">
          <div className={cn("w-11 h-11 rounded-xl border flex items-center justify-center font-display font-bold text-sm shrink-0", colorClass)}>
            {entity.logo}
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold font-display truncate">{entity.name}</h3>
              {entity.status && (
                <Badge variant={entity.status === "active" ? "default" : entity.status === "completed" ? "secondary" : "outline"} className="text-[10px]">
                  {entity.status}
                </Badge>
              )}
            </div>
            {entity.subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{entity.subtitle}</p>
            )}
          </div>

          {/* Meta stats */}
          {entity.meta && (
            <div className="hidden sm:flex items-center gap-4">
              {entity.meta.map((m) => (
                <div key={m.label} className="text-center">
                  <p className="text-sm font-semibold font-display">{m.value}</p>
                  <p className="text-[10px] text-muted-foreground">{m.label}</p>
                </div>
              ))}
            </div>
          )}

          {actions && <div className="shrink-0" onClick={(e) => e.stopPropagation()}>{actions}</div>}

          <div className={cn("w-6 h-6 rounded-md flex items-center justify-center transition-colors shrink-0", open ? "bg-primary/10" : "bg-secondary")}>
            {open ? <ChevronDown className="w-3.5 h-3.5 text-primary" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
          </div>
        </button>
      </Collapsible.Trigger>

      <Collapsible.Content forceMount>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="border-t border-border p-4">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

// ─── Lazy load wrapper for items inside a group ───

interface LazyItemListProps<T> {
  items: T[];
  initialCount?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  loadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  sentinelRef?: (node: HTMLDivElement | null) => void;
  emptyMessage?: string;
  className?: string;
}

export function LazyItemList<T>({
  items,
  initialCount = 4,
  renderItem,
  loadingMore,
  hasMore,
  onLoadMore,
  sentinelRef,
  emptyMessage = "No items found",
  className,
}: LazyItemListProps<T>) {
  const [showAll, setShowAll] = useState(false);

  // If using external infinite scroll, show all items
  const useExternalScroll = !!sentinelRef;
  const displayed = useExternalScroll || showAll ? items : items.slice(0, initialCount);
  const localHasMore = !useExternalScroll && items.length > initialCount && !showAll;

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-6">{emptyMessage}</p>;
  }

  return (
    <div className={cn("space-y-3", className)}>
      {displayed.map((item, i) => renderItem(item, i))}

      {/* Local "show more" */}
      {localHasMore && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-2 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-lg border border-dashed border-border hover:border-primary/30"
        >
          Show {items.length - initialCount} more
        </button>
      )}
      {showAll && !useExternalScroll && items.length > initialCount && (
        <button
          onClick={() => setShowAll(false)}
          className="w-full py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Show less
        </button>
      )}

      {/* External infinite scroll sentinel */}
      {useExternalScroll && hasMore && (
        <div ref={sentinelRef} className="flex items-center justify-center py-4">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          <span className="text-xs text-muted-foreground ml-2">Loading more...</span>
        </div>
      )}

      {loadingMore && !sentinelRef && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

// ─── Entity Group List skeleton ───

export function EntityGroupSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card shadow-card p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="w-11 h-11 rounded-xl" />
            <div className="flex-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-28 mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-20 rounded-lg" />
            <Skeleton className="h-20 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
