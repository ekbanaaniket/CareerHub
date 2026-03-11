import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/contexts/AppContext";
import { Building2, Globe, Mail, Phone, MapPin, Save, Bell, Palette, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function InstituteSettings() {
  const { currentInstitute } = useApp();

  return (
    <div className="space-y-6">
      <PageHeader title="Institute Settings" description={`Configure ${currentInstitute.name}`} />

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general"><Building2 className="w-3.5 h-3.5 mr-1" />General</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="w-3.5 h-3.5 mr-1" />Notifications</TabsTrigger>
          <TabsTrigger value="branding"><Palette className="w-3.5 h-3.5 mr-1" />Branding</TabsTrigger>
          <TabsTrigger value="security"><Shield className="w-3.5 h-3.5 mr-1" />Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-xl border border-border shadow-card p-6 space-y-6 mt-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-xl">
                {currentInstitute.logo}
              </div>
              <div>
                <h3 className="font-semibold font-display">{currentInstitute.name}</h3>
                <p className="text-sm text-muted-foreground">Manage your institute's information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Institute Name</Label><Input defaultValue={currentInstitute.name} className="mt-1" /></div>
              <div><Label>Website</Label><div className="relative mt-1"><Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input defaultValue="https://techverse.academy" className="pl-9" /></div></div>
              <div><Label>Email</Label><div className="relative mt-1"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input defaultValue="admin@techverse.academy" className="pl-9" /></div></div>
              <div><Label>Phone</Label><div className="relative mt-1"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input defaultValue="+1 234-567-8900" className="pl-9" /></div></div>
            </div>
            <div><Label>Address</Label><div className="relative mt-1"><MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" /><Textarea defaultValue="123 Tech Street, Silicon Valley, CA 94000" className="pl-9" /></div></div>
            <div><Label>Description</Label><Textarea defaultValue="Premier technology education institute offering comprehensive full-stack development programs." className="mt-1" /></div>
            <Button><Save className="w-4 h-4 mr-1" /> Save Changes</Button>
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-xl border border-border shadow-card p-6 space-y-4 mt-4">
            <h3 className="font-semibold font-display">Notification Preferences</h3>
            {[
              { label: "Student enrollment notifications", desc: "Get notified when a new student enrolls", default: true },
              { label: "Test submission alerts", desc: "Notify when students submit tests", default: true },
              { label: "Performance alerts", desc: "Alert when students fall below threshold", default: true },
              { label: "Weekly reports", desc: "Receive weekly summary reports via email", default: false },
              { label: "System updates", desc: "Get notified about platform updates", default: true },
            ].map((n, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium">{n.label}</p>
                  <p className="text-xs text-muted-foreground">{n.desc}</p>
                </div>
                <Switch defaultChecked={n.default} />
              </div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="branding">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-xl border border-border shadow-card p-6 space-y-4 mt-4">
            <h3 className="font-semibold font-display">Branding Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Primary Color</Label><Input type="color" defaultValue="#4F7DF3" className="mt-1 h-10" /></div>
              <div><Label>Accent Color</Label><Input type="color" defaultValue="#34C88A" className="mt-1 h-10" /></div>
            </div>
            <div><Label>Logo URL</Label><Input placeholder="https://..." className="mt-1" /></div>
            <Button><Save className="w-4 h-4 mr-1" /> Save Branding</Button>
          </motion.div>
        </TabsContent>

        <TabsContent value="security">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-xl border border-border shadow-card p-6 space-y-4 mt-4">
            <h3 className="font-semibold font-display">Security Settings</h3>
            {[
              { label: "Two-factor authentication", desc: "Require 2FA for all admin accounts", default: false },
              { label: "Session timeout", desc: "Auto-logout after 30 minutes of inactivity", default: true },
              { label: "IP whitelisting", desc: "Restrict access to specific IP addresses", default: false },
              { label: "Audit logging", desc: "Log all admin actions for compliance", default: true },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
                <Switch defaultChecked={s.default} />
              </div>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
