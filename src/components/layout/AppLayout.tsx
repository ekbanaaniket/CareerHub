import { Link, useLocation } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, Bell, Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { GroupedSidebar } from "./GroupedSidebar";
import { RoleSwitcher } from "./RoleSwitcher";
import { UserMenu } from "./UserMenu";
import { Breadcrumbs } from "./Breadcrumbs";
import { NotificationPanel } from "./NotificationPanel";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useUnreadCount } from "@/hooks/useNotifications";
import { Input } from "@/components/ui/input";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { currentInstitute, sidebarOpen, setSidebarOpen } = useApp();
  const { user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const unreadCount = useUnreadCount(user?.id ?? "").data ?? 0;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-border bg-card transition-all duration-300",
          sidebarOpen ? "w-60" : "w-[68px]"
        )}
      >
        {/* Sidebar Header — contextual per role */}
        <div className="p-3 border-b border-border">
          {(() => {
            const role = user?.role;
            // Org owners see their org branding
            if ((role === "institute_owner" || role === "consultancy_owner" || role === "company") && currentInstitute) {
              return (
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-xs shrink-0">
                    {currentInstitute.logo}
                  </div>
                  {sidebarOpen && (
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate font-display">{currentInstitute.name}</p>
                      <p className="text-[10px] text-muted-foreground capitalize">{currentInstitute.role}</p>
                    </div>
                  )}
                </div>
              );
            }
            // Platform owner sees platform brand
            if (role === "platform_owner") {
              return (
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-xs shrink-0">
                    EP
                  </div>
                  {sidebarOpen && (
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate font-display">EduPlatform</p>
                      <p className="text-[10px] text-muted-foreground">Platform Admin</p>
                    </div>
                  )}
                </div>
              );
            }
            // Students, instructors, public — show user profile
            return (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-foreground font-display font-bold text-xs shrink-0">
                  {user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) ?? "U"}
                </div>
                {sidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate font-display">{user?.name ?? "User"}</p>
                    <p className="text-[10px] text-muted-foreground capitalize">{role?.replace("_", " ") ?? "Guest"}</p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        <GroupedSidebar collapsed={!sidebarOpen} />

        {sidebarOpen && (
          <div className="border-t border-border">
            <RoleSwitcher />
          </div>
        )}

        <div className="p-2.5 border-t border-border">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-secondary transition-colors"
          >
            <Menu className="w-3.5 h-3.5" />
            {sidebarOpen && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-68 bg-card border-r border-border z-50 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-3 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-xs">{user?.name?.[0] ?? "U"}</div>
                  <div>
                    <p className="text-xs font-semibold font-display">{user?.name}</p>
                    <p className="text-[10px] text-muted-foreground capitalize">{user?.role?.replace("_", " ")}</p>
                  </div>
                </div>
                <button onClick={() => setMobileMenuOpen(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
              </div>
              <GroupedSidebar collapsed={false} />
              <div className="border-t border-border"><RoleSwitcher /></div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-3 lg:px-5 shrink-0">
          <div className="flex items-center gap-2.5">
            <button className="lg:hidden" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-4 h-4 text-muted-foreground" />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-secondary rounded-lg px-2.5 py-1.5 w-56">
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
              <input type="text" placeholder="Search anything..." className="bg-transparent text-xs outline-none flex-1 placeholder:text-muted-foreground" />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <button className="relative p-1.5 rounded-lg hover:bg-secondary transition-colors" onClick={() => setNotifOpen(!notifOpen)}>
              <Bell className="w-4 h-4 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center px-1">
                  {unreadCount}
                </span>
              )}
            </button>
            <UserMenu />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-3 lg:p-5">
          <Breadcrumbs />
          {children}
        </main>
      </div>

      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  );
}
