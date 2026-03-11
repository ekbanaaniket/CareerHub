// ============= Grouped Sidebar Component =============
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigation } from "@/hooks/useNavigation";
import { getIcon } from "@/services/navigation";
import { cn } from "@/lib/utils";
import { ChevronDown, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface GroupedSidebarProps {
  collapsed: boolean;
}

export function GroupedSidebar({ collapsed }: GroupedSidebarProps) {
  const { user } = useAuth();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const { data: navConfig } = useNavigation(user?.role, user?.instituteId, user?.assignedInstructorId);

  if (!user || !navConfig) return null;

  const navGroups = navConfig.groups;

  const activeGroup = navGroups.find((g) =>
    g.items.some((item) => item.path === location.pathname)
  );

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isGroupExpanded = (label: string) => {
    if (collapsed) return false;
    if (expandedGroups[label] !== undefined) return expandedGroups[label];
    return activeGroup?.label === label;
  };

  return (
    <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto scrollbar-thin">
      {navGroups.map((group, groupIdx) => {
        const expanded = isGroupExpanded(group.label);
        const hasActiveItem = group.items.some((item) => item.path === location.pathname);

        return (
          <div key={group.label} className="mb-0.5">
            {!collapsed ? (
              <button
                onClick={() => toggleGroup(group.label)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all duration-200",
                  hasActiveItem
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground/70 hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <span className="flex items-center gap-1.5">
                  {hasActiveItem && <Sparkles className="w-2.5 h-2.5" />}
                  {group.label}
                </span>
                <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-3 h-3" />
                </motion.div>
              </button>
            ) : (
              groupIdx > 0 && <div className="w-6 h-px bg-border mx-auto my-2" />
            )}

            <AnimatePresence initial={false}>
              {(expanded || collapsed) && (
                <motion.div
                  initial={collapsed ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="space-y-0.5 mt-1 px-0.5">
                    {group.items.map((item) => {
                      const isActive = location.pathname === item.path;
                      const Icon = getIcon(item.iconName);
                      const linkContent = (
                        <Link
                          key={item.path}
                          to={item.path}
                          title={collapsed ? item.label : undefined}
                          className={cn(
                            "group relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary/80",
                            collapsed && "justify-center px-2"
                          )}
                        >
                          <Icon className={cn(
                            "w-4 h-4 shrink-0 transition-transform duration-200",
                            !isActive && "group-hover:scale-110"
                          )} />
                          {!collapsed && (
                            <span className="truncate">{item.label}</span>
                          )}
                          {!collapsed && item.badge && (
                            <span className="ml-auto text-[9px] font-bold bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded-full min-w-[18px] text-center animate-pulse">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );

                      if (collapsed) {
                        return (
                          <Tooltip key={item.path} delayDuration={0}>
                            <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                            <TooltipContent side="right" className="text-xs font-medium">
                              {item.label}
                              {item.badge && <span className="ml-1.5 text-destructive">({item.badge})</span>}
                            </TooltipContent>
                          </Tooltip>
                        );
                      }

                      return linkContent;
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </nav>
  );
}
