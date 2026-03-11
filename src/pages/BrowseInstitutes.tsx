import { Link } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicInstitutes } from "@/services/publicInstitutes";
import PublicHeader from "@/components/layout/PublicHeader";
import { FeaturedCarousel } from "@/components/common/FeaturedCarousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Search, MapPin, Star, GraduationCap, CheckCircle, CreditCard, Award } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { PublicInstitute } from "@/services/publicInstitutes";

export default function BrowseInstitutes() {
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [modeFilter, setModeFilter] = useState("all");
  const [loginOpen, setLoginOpen] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState<PublicInstitute | null>(null);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [regForm, setRegForm] = useState({ name: "", email: "", phone: "", course: "" });

  const { data: institutes = [], isLoading } = useQuery({
    queryKey: ["publicInstitutes", search, cityFilter, modeFilter],
    queryFn: () => fetchPublicInstitutes({ search: search || cityFilter, city: cityFilter, teachingMode: modeFilter }),
    select: (r) => r.data,
  });

  const featured = institutes.filter((i) => i.isFeatured);
  const regular = institutes.filter((i) => !i.isFeatured);

  const handleRegister = () => {
    toast.success(`Registration initiated for ${selectedInstitute?.name}! Redirecting to payment...`);
    setRegisterOpen(false);
    setRegForm({ name: "", email: "", phone: "", course: "" });
  };

  const modeIcon = (mode: string) => {
    switch (mode) { case "online": return "🌐"; case "offline": return "🏫"; case "hybrid": return "🔄"; default: return ""; }
  };

  const renderInstituteCard = (inst: PublicInstitute, _i: number, isFeatured = false) => (
    <div key={inst.id} className={`bg-card rounded-xl border shadow-card p-5 hover:shadow-elevated transition-shadow relative ${
      isFeatured ? "border-primary/40 ring-1 ring-primary/20" : "border-border"
    }`}>
      {isFeatured && (
        <div className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center gap-1">
          <Award className="w-3 h-3" /> Featured
        </div>
      )}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold">{inst.logo}</div>
          <div>
            <h3 className="text-base font-semibold font-display">{inst.name}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{inst.city}, {inst.state}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-warning fill-warning" />
          <span className="text-sm font-bold">{inst.rating}</span>
          <span className="text-xs text-muted-foreground">({inst.reviewCount})</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{inst.description}</p>
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
          <>
            <div className="bg-secondary/50 rounded-lg p-2 text-center">
              <p className="text-sm font-bold font-display text-success">{inst.placementRate}%</p>
              <p className="text-[10px] text-muted-foreground">Placement</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-2 text-center">
              <p className="text-sm font-bold font-display">{inst.avgPackage}</p>
              <p className="text-[10px] text-muted-foreground">Avg Package</p>
            </div>
          </>
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
        <Button variant="outline" size="sm" asChild>
          <Link to={`/institutes/${inst.id}`}>View Details</Link>
        </Button>
        {inst.registrationOpen ? (
          <Button size="sm" onClick={() => { setSelectedInstitute(inst); setRegisterOpen(true); }}>
            <CreditCard className="w-3.5 h-3.5 mr-1" /> Register (${inst.registrationFee})
          </Button>
        ) : (
          <StatusBadge variant="warning">Registration Closed</StatusBadge>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader onLoginClick={() => setLoginOpen(true)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl">Browse Institutes</h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Explore and compare top educational institutes on the platform.
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by name, city, or course..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Input placeholder="Filter by city..." className="w-full sm:w-40" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} />
          <Select value={modeFilter} onValueChange={setModeFilter}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modes</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground text-sm">Loading institutes...</div>
        ) : (
          <>
            {/* Featured Carousel */}
            {featured.length > 0 && (
              <FeaturedCarousel
                items={featured}
                title="Featured Institutes"
                visibleCount={2}
                autoplayInterval={3500}
                renderCard={(inst, i) => renderInstituteCard(inst, i, true)}
              />
            )}

            {/* Regular Section */}
            {regular.length > 0 && (
              <div className="space-y-3">
                {featured.length > 0 && (
                  <h2 className="font-display font-semibold text-base text-muted-foreground">All Institutes</h2>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {regular.map((inst, i) => renderInstituteCard(inst, i))}
                </div>
              </div>
            )}
          </>
        )}

        {!isLoading && institutes.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">No institutes found matching your criteria</div>
        )}
      </div>

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
          </div>
        </DialogContent>
      </Dialog>

      <footer className="border-t border-border py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-xs">ED</div>
            <span className="font-display font-semibold text-sm">EduPlatform</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 EduPlatform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
