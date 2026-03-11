// ============= Profile Page =============
import { PageHeader } from "@/components/common/PageHeader";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { User, Mail, Phone, MapPin, Save, Shield } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ROLE_CONFIGS } from "@/config/roles";

export default function ProfilePage() {
  const { user, effectivePermissions } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" description="View and manage your personal information" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-6 text-center">
          <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-2xl mx-auto mb-4">
            {user.name?.split(" ").map((n) => n[0]).join("")}
          </div>
          <h2 className="font-display font-bold text-lg">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <div className="mt-3">
            <StatusBadge variant="default">{ROLE_CONFIGS[user.role]?.label ?? user.role}</StatusBadge>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Permissions ({effectivePermissions.length})</p>
            <div className="flex flex-wrap gap-1 justify-center">
              {effectivePermissions.slice(0, 8).map((p) => (
                <span key={p} className="px-2 py-0.5 rounded-md bg-secondary text-[10px] text-muted-foreground">{p}</span>
              ))}
              {effectivePermissions.length > 8 && (
                <span className="px-2 py-0.5 rounded-md bg-secondary text-[10px] text-muted-foreground">+{effectivePermissions.length - 8} more</span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Edit Form */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 bg-card rounded-xl border border-border shadow-card p-6 space-y-4">
          <h3 className="font-display font-semibold">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Full Name</Label>
              <div className="relative mt-1"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input defaultValue={user.name} className="pl-9" /></div>
            </div>
            <div>
              <Label>Email</Label>
              <div className="relative mt-1"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input defaultValue={user.email} className="pl-9" readOnly /></div>
            </div>
            <div>
              <Label>Phone</Label>
              <div className="relative mt-1"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="+1 (234) 567-890" className="pl-9" /></div>
            </div>
            <div>
              <Label>Location</Label>
              <div className="relative mt-1"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="City, Country" className="pl-9" /></div>
            </div>
          </div>
          <div>
            <Label>Bio</Label>
            <Textarea placeholder="Tell us about yourself..." className="mt-1" />
          </div>
          <Button onClick={() => toast.success("Profile updated successfully")}>
            <Save className="w-4 h-4 mr-1" /> Save Changes
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
