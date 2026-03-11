import { useState } from "react";
import { Bell, Check, CheckCheck, Trash2, X, Info, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications, useMarkNotificationRead, useMarkAllRead, useDeleteNotification } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { Notification } from "@/types";

const typeIcons: Record<string, React.ElementType> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

const typeColors: Record<string, string> = {
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  error: "text-destructive",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const { data: notifications } = useNotifications(user?.id ?? "");
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllRead();
  const deleteNotif = useDeleteNotification();
  const navigate = useNavigate();

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  const handleClick = (n: Notification) => {
    if (!n.read) markRead.mutate(n.id);
    if (n.link) {
      navigate(n.link);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -8, x: 8 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed top-16 right-4 w-96 max-h-[70vh] bg-card border border-border rounded-xl shadow-elevated z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-semibold text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">{unreadCount}</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => markAllRead.mutate(user?.id ?? "")} className="text-xs">
                    <CheckCheck className="w-3.5 h-3.5 mr-1" /> Mark all read
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1">
              {!notifications?.length ? (
                <div className="p-8 text-center text-sm text-muted-foreground">No notifications</div>
              ) : (
                notifications.map((n) => {
                  const Icon = typeIcons[n.type] || Info;
                  return (
                    <div
                      key={n.id}
                      onClick={() => handleClick(n)}
                      className={cn(
                        "flex gap-3 p-3 border-b border-border cursor-pointer hover:bg-secondary/50 transition-colors",
                        !n.read && "bg-primary/5"
                      )}
                    >
                      <div className={cn("mt-0.5 shrink-0", typeColors[n.type])}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm", !n.read && "font-medium")}>{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{timeAgo(n.createdAt)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100"
                        onClick={(e) => { e.stopPropagation(); deleteNotif.mutate(n.id); }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
