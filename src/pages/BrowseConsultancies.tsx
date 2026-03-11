import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { usePublicConsultancies } from "@/hooks/usePublicConsultancies";
import PublicHeader from "@/components/layout/PublicHeader";
import { FeaturedCarousel } from "@/components/common/FeaturedCarousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Star, Globe, CheckCircle, Award, Mail, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { getConsultancyFilterOptions } from "@/services/publicConsultancies";

export default function BrowseConsultancies() {
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [loginOpen, setLoginOpen] = useState(false);

  const filterOptions = useMemo(() => getConsultancyFilterOptions(), []);

  const { data: consultancies = [], isLoading } = usePublicConsultancies({
    search,
    country: countryFilter !== "all" ? countryFilter : undefined,
    specialization: specializationFilter !== "all" ? specializationFilter : undefined,
    city: cityFilter !== "all" ? cityFilter : undefined,
  });

  const featured = consultancies.filter((c) => c.isFeatured);
  const regular = consultancies.filter((c) => !c.isFeatured);

  const renderCard = (con: typeof consultancies[0], _i: number, isFeatured = false) => (
    <div key={con.id} className={`bg-card rounded-xl border shadow-card p-5 hover:shadow-elevated transition-shadow relative ${
      isFeatured ? "border-primary/40 ring-1 ring-primary/20" : "border-border"
    }`}>
      {isFeatured && (
        <div className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center gap-1">
          <Award className="w-3 h-3" /> Featured
        </div>
      )}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-display font-bold">{con.logo}</div>
          <div>
            <h3 className="text-base font-semibold font-display">{con.name}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{con.city}, {con.state} • Est. {con.established}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-warning fill-warning" />
          <span className="text-sm font-bold">{con.rating}</span>
          <span className="text-xs text-muted-foreground">({con.reviewCount})</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{con.description}</p>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-secondary/50 rounded-lg p-2 text-center">
          <p className="text-sm font-bold font-display">{con.activeStudents}</p>
          <p className="text-[10px] text-muted-foreground">Active Students</p>
        </div>
        <div className="bg-secondary/50 rounded-lg p-2 text-center">
          <p className="text-sm font-bold font-display">{con.totalPlacements.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">Placed</p>
        </div>
        <div className="bg-secondary/50 rounded-lg p-2 text-center">
          <p className="text-sm font-bold font-display text-success">{con.successRate}%</p>
          <p className="text-[10px] text-muted-foreground">Success Rate</p>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Countries</p>
        <div className="flex flex-wrap gap-1.5">
          {con.countries.map((c) => (
            <span key={c} className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-xs text-primary">
              <Globe className="w-3 h-3" />{c}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Services</p>
        <div className="flex flex-wrap gap-1.5">
          {con.services.slice(0, 4).map((s) => (
            <span key={s} className="px-2 py-0.5 rounded-md bg-secondary text-xs text-muted-foreground">{s}</span>
          ))}
          {con.services.length > 4 && (
            <span className="px-2 py-0.5 rounded-md bg-secondary text-xs text-muted-foreground">+{con.services.length - 4} more</span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {con.features.map((f) => (
          <span key={f} className="flex items-center gap-1 text-[10px] text-success"><CheckCircle className="w-3 h-3" />{f}</span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{con.contactEmail}</span>
        </div>
        <Button size="sm" asChild>
          <Link to={`/consultancies/${con.id}`}>View Profile</Link>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader onLoginClick={() => setLoginOpen(true)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl">Browse Consultancies</h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Find trusted education and immigration consultancies to guide your journey abroad.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input placeholder="Search by name, country, or specialization..." className="pl-12 h-11 text-base rounded-xl" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-full sm:w-44"><Globe className="w-3.5 h-3.5 mr-1 text-muted-foreground" /><SelectValue placeholder="Country" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {filterOptions.countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
            <SelectTrigger className="w-full sm:w-44"><Filter className="w-3.5 h-3.5 mr-1 text-muted-foreground" /><SelectValue placeholder="Specialization" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specializations</SelectItem>
              {filterOptions.specializations.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="w-full sm:w-36"><MapPin className="w-3.5 h-3.5 mr-1 text-muted-foreground" /><SelectValue placeholder="City" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {filterOptions.cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground text-sm">Loading consultancies...</div>
        ) : (
          <>
            {/* Featured Carousel */}
            {featured.length > 0 && (
              <FeaturedCarousel
                items={featured}
                title="Featured Consultancies"
                visibleCount={2}
                autoplayInterval={3500}
                renderCard={(con, i) => renderCard(con, i, true)}
              />
            )}

            {/* Regular Section */}
            {regular.length > 0 && (
              <div className="space-y-3">
                {featured.length > 0 && (
                  <h2 className="font-display font-semibold text-base text-muted-foreground">All Consultancies</h2>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {regular.map((con, i) => renderCard(con, i))}
                </div>
              </div>
            )}
          </>
        )}

        {!isLoading && consultancies.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">No consultancies found</div>
        )}
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
