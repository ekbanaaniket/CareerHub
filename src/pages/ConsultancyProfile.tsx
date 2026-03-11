import { useParams, Link } from "react-router-dom";
import { usePublicConsultancyById } from "@/hooks/usePublicConsultancies";
import PublicHeader from "@/components/layout/PublicHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, MapPin, Globe, Users, CheckCircle, Mail, Phone, Plane, Award, Building2, Calendar, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ConsultancyProfile() {
  const { id } = useParams<{ id: string }>();
  const { data: consultancy, isLoading } = usePublicConsultancyById(id ?? "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <PublicHeader />
        <div className="flex items-center justify-center py-20 text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!consultancy) {
    return (
      <div className="min-h-screen bg-background">
        <PublicHeader />
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <h1 className="text-2xl font-display font-bold">Consultancy Not Found</h1>
          <p className="text-muted-foreground">This consultancy doesn't exist or isn't publicly listed.</p>
          <Link to="/browse/consultancies"><Button>Browse Consultancies</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <Link to="/browse/consultancies" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Consultancies
        </Link>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border shadow-card p-6 sm:p-8 relative">
          {consultancy.isFeatured && (
            <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> Featured Consultancy
            </div>
          )}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-display font-bold shrink-0">
              {consultancy.logo}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl font-display font-bold">{consultancy.name}</h1>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-warning fill-warning" />
                  <span className="font-bold">{consultancy.rating}</span>
                  <span className="text-sm text-muted-foreground">({consultancy.reviewCount} reviews)</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                <MapPin className="w-4 h-4" /> {consultancy.city}, {consultancy.state} • Est. {consultancy.established}
              </p>
              <p className="text-sm text-muted-foreground mb-4">{consultancy.description}</p>
              <div className="flex flex-wrap gap-2">
                {consultancy.features.map((f) => (
                  <span key={f} className="flex items-center gap-1 text-xs text-success bg-success/10 px-2 py-1 rounded-md">
                    <CheckCircle className="w-3 h-3" /> {f}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 shrink-0">
              <div className="bg-secondary/50 rounded-xl p-4 text-center min-w-[100px]">
                <p className="text-xl font-bold font-display">{consultancy.activeStudents}</p>
                <p className="text-xs text-muted-foreground">Active Students</p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-4 text-center min-w-[100px]">
                <p className="text-xl font-bold font-display">{consultancy.totalPlacements.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Placed</p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-4 text-center min-w-[100px]">
                <p className="text-xl font-bold font-display text-success">{consultancy.successRate}%</p>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-4 text-center min-w-[100px]">
                <p className="text-xl font-bold font-display">{consultancy.countries.length}</p>
                <p className="text-xs text-muted-foreground">Countries</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabbed Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="countries">Countries</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="font-display font-semibold mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Key Highlights</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-success shrink-0" /> {consultancy.successRate}% visa success rate</li>
                  <li className="flex items-center gap-2 text-sm"><Users className="w-4 h-4 text-primary shrink-0" /> {consultancy.activeStudents} active students</li>
                  <li className="flex items-center gap-2 text-sm"><Building2 className="w-4 h-4 text-muted-foreground shrink-0" /> Established in {consultancy.established}</li>
                  <li className="flex items-center gap-2 text-sm"><Globe className="w-4 h-4 text-primary shrink-0" /> {consultancy.countries.length} countries covered</li>
                </ul>
              </div>
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="font-display font-semibold mb-3 flex items-center gap-2"><Plane className="w-4 h-4 text-primary" /> Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {consultancy.specializations.map((s) => (
                    <span key={s} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary text-sm text-foreground">
                      <Plane className="w-3.5 h-3.5 text-muted-foreground" /> {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="services">
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-display font-semibold mb-4">Services Offered</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {consultancy.services.map((s) => (
                  <div key={s} className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                    <CheckCircle className="w-4 h-4 text-success shrink-0" />
                    <span className="text-sm">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="countries">
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-display font-semibold mb-4">Countries Covered</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {consultancy.countries.map((c) => (
                  <div key={c} className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <Globe className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm font-medium">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-display font-semibold mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <a href={`mailto:${consultancy.contactEmail}`} className="text-sm text-primary hover:underline">{consultancy.contactEmail}</a>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <span className="text-sm">{consultancy.contactPhone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
                  <Globe className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Website</p>
                    <a href={consultancy.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">{consultancy.website}</a>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button className="w-full sm:w-auto">
                  <Mail className="w-4 h-4 mr-2" /> Get in Touch
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

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
