import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: ReactNode;
  gradient?: string;
}

export function StatCard({ title, value, change, changeType = "neutral", icon, gradient }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl p-5 shadow-card border border-border hover:shadow-elevated transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold font-display mt-1">{value}</p>
          {change && (
            <p className={cn(
              "text-xs mt-1 font-medium",
              changeType === "positive" && "text-success",
              changeType === "negative" && "text-destructive",
              changeType === "neutral" && "text-muted-foreground"
            )}>
              {change}
            </p>
          )}
        </div>
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          gradient || "bg-primary/10 text-primary"
        )}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
