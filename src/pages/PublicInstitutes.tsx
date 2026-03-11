// ============= Public Institutes Browse Page =============
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Globe, Search, MapPin, Star, Users, GraduationCap, TrendingUp, Monitor, Building2, CheckCircle, CreditCard } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { fetchPublicInstitutes } from "@/services/publicInstitutes";
import type { PublicInstitute } from "@/services/publicInstitutes";

export default function PublicInstitutes() {
  const navigate = useNavigate();
  const [institutes, setInstitutes] = useState<PublicInstitute[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [modeFilter, setModeFilter] = useState("all");
  const [selectedInstitute, setSelectedInstitute] = useState<PublicInstitute | null>(null);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [regForm, setRegForm] = useState({ name: "", email: "", phone: "", course: "" });

  useEffect(() => {
    setLoading(true);
    fetchPublicInstitutes({ search, city: cityFilter || undefined, teachingMode: modeFilter !== "all" ? modeFilter : undefined }).then((res) => {
      setInstitutes(res.data);
      setLoading(false);
    });
  }, [search, cityFilter, modeFilter]);

  const handleRegister = () => {
    toast({
      title: "Registration initiated!",
      description: `Redirecting to payment gateway for $${selectedInstitute?.registrationFee} registration fee...`,
    });
    setRegisterOpen(false);
    setRegForm({ name: "", email: "", phone: "", course: "" });
  };

  const modeIcon = (mode: string) => {
    switch (mode) { case "online": return "🌐"; case "offline": return "🏫"; case "hybrid": return "🔄"; default: return ""; }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Browse Institutes" description="Explore and compare institutes on the platform" />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name, city, or course..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Input placeholder="Filter by city..." className="w-40" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} />
        <Select value={modeFilter} onValueChange={setModeFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modes</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Loading institutes...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {institutes.map((inst) => (
            <motion.div key={inst.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5 hover:shadow-elevated transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold">
                    {inst.logo}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold font-display">{inst.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{inst.city}, {inst.state} • Est. {inst.established}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-warning fill-warning" />
                  <span className="text-sm font-bold">{inst.rating}</span>
                  <span className="text-xs text-muted-foreground">({inst.reviewCount})</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-3">{inst.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                <div className="bg-secondary/50 rounded-lg p-2 text-center">
                  <p className="text-sm font-bold font-display">{inst.studentCount.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">Students</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-2 text-center">
                  <p className="text-sm font-bold font-display">{inst.courseCount}</p>
                  <p className="text-[10px] text-muted-foreground">Courses</p>
                </div>
                {inst.showPlacementData && (
                  <div className="bg-secondary/50 rounded-lg p-2 text-center">
                    <p className="text-sm font-bold font-display text-success">{inst.placementRate}%</p>
                    <p className="text-[10px] text-muted-foreground">Placement</p>
                  </div>
                )}
                {inst.showPlacementData && (
                  <div className="bg-secondary/50 rounded-lg p-2 text-center">
                    <p className="text-sm font-bold font-display">{inst.avgPackage}</p>
                    <p className="text-[10px] text-muted-foreground">Avg Package</p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {inst.courses.slice(0, 4).map((c) => (
                  <span key={c} className="px-2 py-0.5 rounded-md bg-secondary text-xs text-muted-foreground">{c}</span>
                ))}
                <span className="px-2 py-0.5 rounded-md bg-primary/10 text-xs text-primary">{modeIcon(inst.teachingMode)} {inst.teachingMode}</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {inst.features.map((f) => (
                  <span key={f} className="flex items-center gap-1 text-[10px] text-success"><CheckCircle className="w-3 h-3" />{f}</span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <Button variant="outline" size="sm" onClick={() => navigate(`/institutes/${inst.id}`)}>
                  View Details
                </Button>
                {inst.registrationOpen && (
                  <Button size="sm" onClick={() => { setSelectedInstitute(inst); setRegisterOpen(true); }}>
                    <CreditCard className="w-3.5 h-3.5 mr-1" /> Register (${inst.registrationFee})
                  </Button>
                )}
                {!inst.registrationOpen && (
                  <StatusBadge variant="warning">Registration Closed</StatusBadge>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && institutes.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">No institutes found matching your criteria</div>
      )}

      {/* Registration Dialog */}
      <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Register at {selectedInstitute?.name}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="bg-secondary/50 rounded-lg p-3 flex items-center justify-between">
              <span className="text-sm">Registration Fee</span>
              <span className="text-lg font-bold font-display">${selectedInstitute?.registrationFee}</span>
            </div>
            <div><Label>Full Name</Label><Input placeholder="John Doe" className="mt-1" value={regForm.name} onChange={(e) => setRegForm({ ...regForm, name: e.target.value })} /></div>
            <div><Label>Email</Label><Input type="email" placeholder="john@email.com" className="mt-1" value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} /></div>
            <div><Label>Phone</Label><Input type="tel" placeholder="+1 234-567-8900" className="mt-1" value={regForm.phone} onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })} /></div>
            <div><Label>Preferred Course</Label>
              <Select value={regForm.course} onValueChange={(v) => setRegForm({ ...regForm, course: v })}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select course" /></SelectTrigger>
                <SelectContent>
                  {selectedInstitute?.courses.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleRegister} disabled={!regForm.name || !regForm.email}>
              <CreditCard className="w-4 h-4 mr-1" /> Proceed to Payment
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              You will be redirected to a secure payment gateway
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
