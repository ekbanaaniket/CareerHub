import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useApp } from "@/contexts/AppContext";
import {
  useOrgSettings, useUpdateOrgSettings, useNotificationSettings,
  useUpdateNotificationSetting, useSubscription, useBillingHistory
} from "@/hooks/useSettings";
import { Building2, Globe, Mail, Phone, MapPin, Save, Bell, Palette, Shield, CreditCard, Receipt, User } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";

export default function SettingsPage() {
  const { currentInstitute } = useApp();
  const { data: orgSettings, isLoading: orgLoading } = useOrgSettings();
  const { data: notifSettings = [], isLoading: notifLoading } = useNotificationSettings();
  const { data: subscription, isLoading: subLoading } = useSubscription();
  const { data: billingHistory = [], isLoading: billLoading } = useBillingHistory();
  const updateOrg = useUpdateOrgSettings();
  const updateNotif = useUpdateNotificationSetting();

  const [form, setForm] = useState<Record<string, string>>({});

  const handleSaveGeneral = () => {
    updateOrg.mutate(form as any, {
      onSuccess: () => toast.success("Settings saved successfully"),
    });
  };

  const handleToggleNotif = (id: string, enabled: boolean) => {
    updateNotif.mutate({ id, enabled }, {
      onSuccess: () => toast.success("Notification preference updated"),
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description={`Configure ${currentInstitute.name}`} />

      <Tabs defaultValue="general">
        <TabsList className="flex-wrap">
          <TabsTrigger value="general"><Building2 className="w-3.5 h-3.5 mr-1" />General</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="w-3.5 h-3.5 mr-1" />Notifications</TabsTrigger>
          <TabsTrigger value="branding"><Palette className="w-3.5 h-3.5 mr-1" />Branding</TabsTrigger>
          <TabsTrigger value="subscription"><CreditCard className="w-3.5 h-3.5 mr-1" />Subscription</TabsTrigger>
          <TabsTrigger value="billing"><Receipt className="w-3.5 h-3.5 mr-1" />Billing</TabsTrigger>
          <TabsTrigger value="security"><Shield className="w-3.5 h-3.5 mr-1" />Security</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-xl border border-border shadow-card p-6 space-y-6 mt-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-xl">
                {orgSettings?.logo ?? currentInstitute.logo}
              </div>
              <div>
                <h3 className="font-semibold font-display">{orgSettings?.name ?? currentInstitute.name}</h3>
                <p className="text-sm text-muted-foreground">Manage your organization's information</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Organization Name</Label><Input defaultValue={orgSettings?.name ?? currentInstitute.name} className="mt-1" onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
              <div><Label>Website</Label><div className="relative mt-1"><Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input defaultValue={orgSettings?.website ?? ""} className="pl-9" onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} /></div></div>
              <div><Label>Email</Label><div className="relative mt-1"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input defaultValue={orgSettings?.email ?? ""} className="pl-9" onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} /></div></div>
              <div><Label>Phone</Label><div className="relative mt-1"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input defaultValue={orgSettings?.phone ?? ""} className="pl-9" onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} /></div></div>
              <div><Label>City</Label><Input defaultValue={orgSettings?.city ?? ""} className="mt-1" onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} /></div>
              <div><Label>State</Label><Input defaultValue={orgSettings?.state ?? ""} className="mt-1" onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} /></div>
            </div>
            <div><Label>Address</Label><div className="relative mt-1"><MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" /><Textarea defaultValue={orgSettings?.address ?? ""} className="pl-9" onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} /></div></div>
            <div><Label>Description</Label><Textarea defaultValue={orgSettings?.description ?? ""} className="mt-1" onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></div>
            <Button onClick={handleSaveGeneral} disabled={updateOrg.isPending}>
              <Save className="w-4 h-4 mr-1" /> {updateOrg.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </motion.div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-xl border border-border shadow-card p-6 space-y-4 mt-4">
            <h3 className="font-semibold font-display">Notification Preferences</h3>
            {notifLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : (
              notifSettings.map((n) => (
                <div key={n.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.description}</p>
                  </div>
                  <Switch checked={n.enabled} onCheckedChange={(checked) => handleToggleNotif(n.id, checked)} />
                </div>
              ))
            )}
          </motion.div>
        </TabsContent>

        {/* Branding */}
        <TabsContent value="branding">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-xl border border-border shadow-card p-6 space-y-4 mt-4">
            <h3 className="font-semibold font-display">Branding Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Primary Color</Label><Input type="color" defaultValue="#4F7DF3" className="mt-1 h-10" /></div>
              <div><Label>Accent Color</Label><Input type="color" defaultValue="#34C88A" className="mt-1 h-10" /></div>
            </div>
            <div><Label>Logo URL</Label><Input placeholder="https://..." className="mt-1" /></div>
            <div><Label>Favicon URL</Label><Input placeholder="https://..." className="mt-1" /></div>
            <Button onClick={() => toast.success("Branding saved")}><Save className="w-4 h-4 mr-1" /> Save Branding</Button>
          </motion.div>
        </TabsContent>

        {/* Subscription */}
        <TabsContent value="subscription">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-xl border border-border shadow-card p-6 space-y-6 mt-4">
            <h3 className="font-semibold font-display">Current Subscription</h3>
            {subLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : subscription ? (
              <>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div>
                    <p className="font-display font-bold text-lg">{subscription.name}</p>
                    <p className="text-xs text-muted-foreground">Started {subscription.startDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-extrabold text-2xl">${subscription.price}<span className="text-sm font-normal text-muted-foreground">/{subscription.period}</span></p>
                    <StatusBadge variant={subscription.status === "active" ? "success" : "warning"}>{subscription.status}</StatusBadge>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Included Features</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {subscription.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">Next billing: {subscription.nextBillingDate}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => toast.info("Upgrade options coming soon")}>Upgrade Plan</Button>
                    <Button variant="destructive" size="sm" onClick={() => toast.info("Please contact support to cancel")}>Cancel</Button>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No active subscription</p>
            )}
          </motion.div>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-xl border border-border shadow-card p-6 space-y-4 mt-4">
            <h3 className="font-semibold font-display">Billing History</h3>
            {billLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : (
              <div className="space-y-3">
                {billingHistory.map((b) => (
                  <div key={b.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium">{b.description}</p>
                      <p className="text-xs text-muted-foreground">{b.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-display font-bold">${b.amount}</span>
                      <StatusBadge variant={b.status === "paid" ? "success" : b.status === "pending" ? "warning" : "destructive"}>{b.status}</StatusBadge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </TabsContent>

        {/* Security */}
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
                <div><p className="text-sm font-medium">{s.label}</p><p className="text-xs text-muted-foreground">{s.desc}</p></div>
                <Switch defaultChecked={s.default} />
              </div>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
