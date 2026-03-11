import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Star, MapPin, Users, GraduationCap, Play, Calendar, BookOpen, FileText, Download, Briefcase, ArrowLeft, Globe, CheckCircle, CreditCard, TrendingUp } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for a public institute profile
const INSTITUTES_DATA: Record<string, {
  id: string; name: string; logo: string; city: string; state: string;
  description: string; rating: number; reviewCount: number; studentCount: number;
  courseCount: number; placementRate: number; avgPackage: string;
  teachingMode: string; established: string; website: string;
  registrationOpen: boolean; registrationFee: number;
  features: string[];
  courses: { id: string; name: string; duration: string; modules: number; topics: string[]; status: string }[];
  instructors: { id: string; name: string; title: string; bio: string; expertise: string[]; experience: string; rating: number }[];
  lectures: { id: string; title: string; instructor: string; duration: string; date: string; views: number; status: string; isPublic: boolean }[];
  resources: { id: string; title: string; type: string; size: string; downloads: number; isPublic: boolean }[];
  placements: { company: string; count: number; avgPackage: string }[];
  reviews: { name: string; rating: number; text: string; date: string; course: string }[];
}> = {
  "1": {
    id: "1", name: "TechVerse Academy", logo: "TV", city: "San Francisco", state: "CA",
    description: "Premier technology education institute offering comprehensive full-stack development programs with industry-leading placement support. Our hands-on curriculum, expert instructors, and career-focused approach have helped thousands of students launch successful tech careers.",
    rating: 4.8, reviewCount: 256, studentCount: 1284, courseCount: 24, placementRate: 92, avgPackage: "$145,000",
    teachingMode: "hybrid", established: "2020", website: "https://techverse.academy",
    registrationOpen: true, registrationFee: 500,
    features: ["Live classes", "1:1 Mentorship", "Job guarantee", "Industry projects", "Career support", "Alumni network"],
    courses: [
      { id: "C1", name: "Full-Stack Developer 2026", duration: "24 weeks", modules: 24, topics: ["React", "Node.js", "PostgreSQL", "Docker", "TypeScript"], status: "active" },
      { id: "C2", name: "Frontend Bootcamp", duration: "12 weeks", modules: 12, topics: ["HTML/CSS", "JavaScript", "React", "Tailwind"], status: "active" },
      { id: "C3", name: "Backend Mastery", duration: "16 weeks", modules: 16, topics: ["Node.js", "NestJS", "PostgreSQL", "Redis"], status: "active" },
      { id: "C4", name: "DevOps Fundamentals", duration: "8 weeks", modules: 8, topics: ["Docker", "Kubernetes", "AWS", "CI/CD"], status: "upcoming" },
    ],
    instructors: [
      { id: "I1", name: "John Doe", title: "Lead Instructor - Full Stack", bio: "10+ years of industry experience at Google and Meta. Passionate about teaching modern web development.", expertise: ["React", "Node.js", "System Design", "TypeScript"], experience: "10 years", rating: 4.9 },
      { id: "I2", name: "Jane Smith", title: "Senior Instructor - Frontend", bio: "Former UI Lead at Stripe. Specializes in React performance optimization and design systems.", expertise: ["React", "CSS", "Design Systems", "Performance"], experience: "8 years", rating: 4.8 },
      { id: "I3", name: "Mike Chen", title: "Instructor - DevOps", bio: "AWS Solutions Architect. Previously managed infrastructure at Netflix.", expertise: ["AWS", "Docker", "Kubernetes", "Terraform"], experience: "12 years", rating: 4.7 },
    ],
    lectures: [
      { id: "L1", title: "Introduction to HTML & CSS", instructor: "John Doe", duration: "2h 15m", date: "Jan 15, 2026", views: 2450, status: "recorded", isPublic: true },
      { id: "L2", title: "JavaScript Fundamentals", instructor: "John Doe", duration: "2h 30m", date: "Jan 16, 2026", views: 2300, status: "recorded", isPublic: true },
      { id: "L3", title: "React Basics - Free Preview", instructor: "Jane Smith", duration: "1h 45m", date: "Feb 3, 2026", views: 3200, status: "recorded", isPublic: true },
      { id: "L4", title: "TypeScript Deep Dive (Preview)", instructor: "Jane Smith", duration: "45m", date: "Feb 10, 2026", views: 1800, status: "recorded", isPublic: true },
    ],
    resources: [
      { id: "R1", title: "HTML/CSS Fundamentals Cheatsheet", type: "PDF", size: "2.1 MB", downloads: 5400, isPublic: true },
      { id: "R2", title: "Git Workflow Guide", type: "PDF", size: "1.5 MB", downloads: 3800, isPublic: true },
      { id: "R3", title: "JavaScript ES6+ Quick Reference", type: "PDF", size: "3.2 MB", downloads: 4200, isPublic: true },
    ],
    placements: [
      { company: "Google", count: 12, avgPackage: "$165,000" },
      { company: "Meta", count: 8, avgPackage: "$158,000" },
      { company: "Amazon", count: 15, avgPackage: "$152,000" },
      { company: "Microsoft", count: 10, avgPackage: "$148,000" },
      { company: "Stripe", count: 6, avgPackage: "$155,000" },
      { company: "Netflix", count: 4, avgPackage: "$170,000" },
    ],
    reviews: [
      { name: "David L.", rating: 5, text: "Best investment I've made. The curriculum is incredibly well-structured and the instructors are world-class. Got placed at Google within 2 weeks of graduating!", date: "Feb 2026", course: "Full-Stack Developer" },
      { name: "Grace K.", rating: 5, text: "The mentorship program is outstanding. My mentor helped me prepare for interviews and land my dream job at Microsoft.", date: "Feb 2026", course: "Full-Stack Developer" },
      { name: "Sarah M.", rating: 4, text: "Great course content and supportive community. The only improvement would be more project-based learning in the early weeks.", date: "Jan 2026", course: "Frontend Bootcamp" },
    ],
  },
  "2": {
    id: "2", name: "CodeCraft Institute", logo: "CC", city: "New York", state: "NY",
    description: "Hands-on coding bootcamp focused on practical skills and real-world project experience.",
    rating: 4.6, reviewCount: 180, studentCount: 856, courseCount: 18, placementRate: 88, avgPackage: "$128,000",
    teachingMode: "offline", established: "2019", website: "https://codecraft.io",
    registrationOpen: true, registrationFee: 350,
    features: ["Small batch size", "Weekend classes", "Portfolio building", "Mock interviews"],
    courses: [
      { id: "C1", name: "Web Development", duration: "16 weeks", modules: 16, topics: ["HTML/CSS", "JS", "React", "Node.js"], status: "active" },
      { id: "C2", name: "Data Science", duration: "20 weeks", modules: 20, topics: ["Python", "Pandas", "ML", "SQL"], status: "active" },
    ],
    instructors: [
      { id: "I1", name: "Alex Rivera", title: "Lead Instructor", bio: "Former senior engineer at Twitter.", expertise: ["Python", "ML", "Data Engineering"], experience: "9 years", rating: 4.7 },
    ],
    lectures: [
      { id: "L1", title: "Intro to Web Development", instructor: "Alex Rivera", duration: "1h 30m", date: "Jan 20, 2026", views: 1200, status: "recorded", isPublic: true },
    ],
    resources: [
      { id: "R1", title: "Python Basics Guide", type: "PDF", size: "4.2 MB", downloads: 2100, isPublic: true },
    ],
    placements: [
      { company: "Twitter", count: 5, avgPackage: "$140,000" },
      { company: "Uber", count: 7, avgPackage: "$135,000" },
    ],
    reviews: [
      { name: "Tom H.", rating: 5, text: "Incredible experience. Small class sizes meant personalized attention.", date: "Jan 2026", course: "Web Development" },
    ],
  },
};

export default function PublicInstituteProfile() {
  const { id } = useParams<{ id: string }>();
  const institute = id ? INSTITUTES_DATA[id] : null;
  const [registerOpen, setRegisterOpen] = useState(false);
  const [regForm, setRegForm] = useState({ name: "", email: "", phone: "", course: "" });

  if (!institute) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-display font-bold">Institute Not Found</h1>
          <p className="text-muted-foreground">This institute doesn't exist or isn't publicly listed.</p>
          <Link to="/"><Button>Back to Home</Button></Link>
        </div>
      </div>
    );
  }

  const handleRegister = () => {
    toast({ title: "Registration initiated!", description: `Redirecting to payment for $${institute.registrationFee}...` });
    setRegisterOpen(false);
    setRegForm({ name: "", email: "", phone: "", course: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/dashboard"><Button variant="outline" size="sm">Dashboard</Button></Link>
            {institute.registrationOpen && (
              <Button size="sm" onClick={() => setRegisterOpen(true)}>
                <CreditCard className="w-3.5 h-3.5 mr-1" /> Register (${institute.registrationFee})
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border shadow-card p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-display font-bold shrink-0">
              {institute.logo}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl font-display font-bold">{institute.name}</h1>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-warning fill-warning" />
                  <span className="font-bold">{institute.rating}</span>
                  <span className="text-sm text-muted-foreground">({institute.reviewCount} reviews)</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                <MapPin className="w-4 h-4" /> {institute.city}, {institute.state} • Est. {institute.established} •
                <Globe className="w-4 h-4 ml-1" /> {institute.teachingMode}
              </p>
              <p className="text-sm text-muted-foreground mb-4">{institute.description}</p>
              <div className="flex flex-wrap gap-2">
                {institute.features.map((f) => (
                  <span key={f} className="flex items-center gap-1 text-xs text-success bg-success/10 px-2 py-1 rounded-md">
                    <CheckCircle className="w-3 h-3" /> {f}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 shrink-0">
              <div className="bg-secondary/50 rounded-xl p-4 text-center min-w-[100px]">
                <p className="text-xl font-bold font-display">{institute.studentCount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Students</p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-4 text-center min-w-[100px]">
                <p className="text-xl font-bold font-display">{institute.courseCount}</p>
                <p className="text-xs text-muted-foreground">Courses</p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-4 text-center min-w-[100px]">
                <p className="text-xl font-bold font-display text-success">{institute.placementRate}%</p>
                <p className="text-xs text-muted-foreground">Placement</p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-4 text-center min-w-[100px]">
                <p className="text-xl font-bold font-display">{institute.avgPackage}</p>
                <p className="text-xs text-muted-foreground">Avg Package</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="flex-wrap">
            <TabsTrigger value="courses"><GraduationCap className="w-3.5 h-3.5 mr-1" /> Courses</TabsTrigger>
            <TabsTrigger value="instructors"><Users className="w-3.5 h-3.5 mr-1" /> Instructors</TabsTrigger>
            <TabsTrigger value="lectures"><Play className="w-3.5 h-3.5 mr-1" /> Free Lectures</TabsTrigger>
            <TabsTrigger value="resources"><FileText className="w-3.5 h-3.5 mr-1" /> Free Resources</TabsTrigger>
            <TabsTrigger value="placements"><Briefcase className="w-3.5 h-3.5 mr-1" /> Placements</TabsTrigger>
            <TabsTrigger value="reviews"><Star className="w-3.5 h-3.5 mr-1" /> Reviews</TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {institute.courses.map((c) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5 hover:shadow-elevated transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center"><GraduationCap className="w-5 h-5 text-primary-foreground" /></div>
                      <div>
                        <h3 className="text-sm font-semibold font-display">{c.name}</h3>
                        <p className="text-xs text-muted-foreground">{c.duration} • {c.modules} modules</p>
                      </div>
                    </div>
                    <StatusBadge variant={c.status === "active" ? "success" : "info"}>{c.status}</StatusBadge>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {c.topics.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-md bg-secondary text-xs text-muted-foreground">{t}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Instructors Tab */}
          <TabsContent value="instructors">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {institute.instructors.map((inst) => (
                <motion.div key={inst.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5 hover:shadow-elevated transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {inst.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold font-display">{inst.name}</h3>
                      <p className="text-xs text-muted-foreground">{inst.title}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{inst.bio}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {inst.expertise.map((e) => (
                      <span key={e} className="px-2 py-0.5 rounded-md bg-primary/10 text-xs text-primary">{e}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                    <span>{inst.experience} experience</span>
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-warning fill-warning" /> {inst.rating}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Lectures Tab */}
          <TabsContent value="lectures">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {institute.lectures.filter((l) => l.isPublic).map((lec) => (
                <motion.div key={lec.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card overflow-hidden hover:shadow-elevated transition-all group cursor-pointer">
                  <div className="relative h-36 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                      <Play className="w-5 h-5 text-primary ml-0.5" />
                    </div>
                    <div className="absolute top-2 left-2">
                      <StatusBadge variant="success">Free Preview</StatusBadge>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-foreground/80 text-background text-xs px-2 py-0.5 rounded">{lec.duration}</div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold font-display mb-2 line-clamp-2">{lec.title}</h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{lec.instructor}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {lec.views.toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground mt-4">Register to access the full library of {institute.courseCount * 8}+ lectures</p>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources">
            <div className="space-y-3">
              {institute.resources.filter((r) => r.isPublic).map((r) => (
                <motion.div key={r.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-xl border border-border shadow-card p-4 flex items-center gap-4 hover:shadow-elevated transition-shadow">
                  <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center shrink-0"><FileText className="w-5 h-5 text-info" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.type} • {r.size}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Download className="w-3 h-3" /> {r.downloads.toLocaleString()}</span>
                    <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5 mr-1" /> Download</Button>
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground mt-4">Register to access all study materials and resources</p>
          </TabsContent>

          {/* Placements Tab */}
          <TabsContent value="placements">
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-card rounded-xl border border-border shadow-card p-5 text-center">
                  <p className="text-3xl font-bold font-display text-success">{institute.placementRate}%</p>
                  <p className="text-sm text-muted-foreground mt-1">Placement Rate</p>
                </div>
                <div className="bg-card rounded-xl border border-border shadow-card p-5 text-center">
                  <p className="text-3xl font-bold font-display">{institute.avgPackage}</p>
                  <p className="text-sm text-muted-foreground mt-1">Average Package</p>
                </div>
                <div className="bg-card rounded-xl border border-border shadow-card p-5 text-center">
                  <p className="text-3xl font-bold font-display">{institute.placements.length}+</p>
                  <p className="text-sm text-muted-foreground mt-1">Partner Companies</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {institute.placements.map((p) => (
                  <motion.div key={p.company} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-4 flex items-center gap-4 hover:shadow-elevated transition-shadow">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Briefcase className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold font-display">{p.company}</p>
                      <p className="text-xs text-muted-foreground">{p.count} placements • Avg {p.avgPackage}</p>
                    </div>
                    <TrendingUp className="w-4 h-4 text-success" />
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className="space-y-4">
              {institute.reviews.map((r, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5 hover:shadow-elevated transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {r.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.course} • {r.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`w-3.5 h-3.5 ${j < r.rating ? "text-warning fill-warning" : "text-muted-foreground/30"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{r.text}</p>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Registration Dialog */}
      <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Register at {institute.name}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="bg-secondary/50 rounded-lg p-3 flex items-center justify-between">
              <span className="text-sm">Registration Fee</span>
              <span className="text-lg font-bold font-display">${institute.registrationFee}</span>
            </div>
            <div><Label>Full Name</Label><Input placeholder="John Doe" className="mt-1" value={regForm.name} onChange={(e) => setRegForm({ ...regForm, name: e.target.value })} /></div>
            <div><Label>Email</Label><Input type="email" placeholder="john@email.com" className="mt-1" value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} /></div>
            <div><Label>Phone</Label><Input type="tel" placeholder="+1 234-567-8900" className="mt-1" value={regForm.phone} onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })} /></div>
            <div><Label>Preferred Course</Label>
              <Select value={regForm.course} onValueChange={(v) => setRegForm({ ...regForm, course: v })}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select course" /></SelectTrigger>
                <SelectContent>
                  {institute.courses.map((c) => (
                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
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
    </div>
  );
}
