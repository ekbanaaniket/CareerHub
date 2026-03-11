import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import PublicHeader from "@/components/layout/PublicHeader";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  GraduationCap, Users, BarChart3, Shield, BookOpen, Briefcase,
  ArrowRight, CheckCircle, Star, Globe, Zap, LogIn, Plane, CreditCard,
  Building2, Video, FileText, CalendarCheck, Languages, UserCheck,
  TrendingUp, Target, Clock, Award, Layers, Lock, HeartHandshake,
  ChevronRight, Sparkles, Play
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────

const stats = [
  { value: "50+", label: "Institutes Onboarded", icon: Building2 },
  { value: "30+", label: "Active Consultancies", icon: Globe },
  { value: "100+", label: "Partner Companies", icon: Briefcase },
  { value: "10K+", label: "Students Managed", icon: Users },
  { value: "95%", label: "Client Satisfaction", icon: Star },
  { value: "24/7", label: "Platform Availability", icon: Clock },
];

const roleCards = [
  {
    role: "Institutes",
    tagline: "Digitize your entire academy",
    icon: GraduationCap,
    color: "from-primary to-[hsl(252,78%,65%)]",
    bgLight: "bg-primary/5",
    textColor: "text-primary",
    features: [
      "Course & curriculum management",
      "Student enrollment & attendance",
      "Tests, exams & grading",
      "Library & resource sharing",
      "Fee collection & billing",
      "Progress reports & analytics",
    ],
  },
  {
    role: "Consultancies",
    tagline: "Streamline immigration & admissions",
    icon: Plane,
    color: "from-accent to-[hsl(170,60%,45%)]",
    bgLight: "bg-accent/5",
    textColor: "text-accent",
    features: [
      "Visa application tracking",
      "University admission management",
      "Language course enrollment",
      "Counselor assignment & performance",
      "Document management",
      "Student pipeline analytics",
    ],
  },
  {
    role: "Companies",
    tagline: "Hire smarter, place faster",
    icon: Briefcase,
    color: "from-warning to-[hsl(20,85%,55%)]",
    bgLight: "bg-warning/5",
    textColor: "text-warning",
    features: [
      "Job vacancy posting",
      "Candidate pipeline management",
      "Placement tracking",
      "Campus recruitment drives",
      "Hiring analytics & reports",
      "Interview scheduling",
    ],
  },
];

const platformFeatures = [
  { icon: Shield, title: "Role-Based Access Control", desc: "Granular permissions across Platform → Institute → Consultancy → Company hierarchy. Every user sees only what they need." },
  { icon: BarChart3, title: "Advanced Analytics", desc: "Deep insights with interactive charts — enrollment trends, placement rates, visa status, revenue tracking, and more." },
  { icon: Layers, title: "Multi-Tenant Architecture", desc: "Manage multiple institutes, consultancies, and companies from a single platform with complete data isolation." },
  { icon: Lock, title: "Enterprise Security", desc: "Bank-grade security with encrypted data, audit trails, and compliance-ready infrastructure." },
  { icon: Sparkles, title: "Automated Workflows", desc: "From enrollment to placement — automate repetitive tasks, notifications, and status updates." },
  { icon: HeartHandshake, title: "Unified Experience", desc: "Students, counselors, instructors, and HR — everyone gets a tailored dashboard in one platform." },
];

const howItWorks = [
  { step: "01", title: "Register Your Organization", desc: "Sign up as an institute, consultancy, or company in under 2 minutes." },
  { step: "02", title: "Set Up Your Team", desc: "Invite instructors, counselors, or HR staff with role-based permissions." },
  { step: "03", title: "Onboard Students", desc: "Enroll students, assign courses, or manage visa applications instantly." },
  { step: "04", title: "Track & Grow", desc: "Monitor performance with real-time analytics and scale your operations." },
];

const testimonials = [
  { name: "Dr. Priya Sharma", role: "Institute Owner, TechVerse Academy", text: "This platform transformed how we manage our academy. The permission system lets us control exactly what each instructor and student can access. Our admin workload dropped by 60%.", rating: 5, avatar: "PS" },
  { name: "Ravi Kumar", role: "Founder, Global Consultancy", text: "Managing visa applications, university admissions, and counselors all in one place has been a game-changer. We now process 3x more applications without adding staff.", rating: 5, avatar: "RK" },
  { name: "Maria Gonzalez", role: "HR Director, TechCorp", text: "Campus recruitment has never been easier. We post vacancies, track candidates, and manage placements from a single dashboard. The analytics are incredibly insightful.", rating: 5, avatar: "MG" },
  { name: "Anil Patel", role: "Student, CodeCraft Institute", text: "I can see my courses, test scores, attendance, and even my visa status in one app. It keeps everything organized and I never miss important updates.", rating: 5, avatar: "AP" },
];

const faqs = [
  { q: "Is there a free plan available?", a: "Yes! We offer a free tier for small organizations with up to 50 students. Upgrade anytime as you grow." },
  { q: "Can I manage multiple institutes?", a: "Absolutely. Platform owners can manage unlimited institutes, consultancies, and companies from one dashboard." },
  { q: "How secure is the platform?", a: "We use enterprise-grade encryption, role-based access control, and regular security audits to protect your data." },
  { q: "Can students access the platform?", a: "Yes, students get their own dashboard to view courses, tests, attendance, fees, visa status, and placement updates." },
  { q: "Do you offer custom integrations?", a: "Our Enterprise plan includes API access and custom integrations. Contact our sales team for details." },
];

// ─── Animations ──────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

// ─── Component ───────────────────────────────────────────────────────

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <PublicHeader />

      {/* ══════ HERO ══════ */}
      <section ref={heroRef} className="relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-warning/5 blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>

        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-20 sm:pb-32 text-center relative">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} custom={0}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-8">
                <Sparkles className="w-3.5 h-3.5" />
                Trusted by 50+ organizations worldwide
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="font-display font-extrabold text-4xl sm:text-5xl lg:text-7xl leading-[1.1] tracking-tight mb-6">
              The All-in-One Platform
              <br />
              <span className="relative">
                <span className="bg-gradient-to-r from-primary via-accent to-warning bg-clip-text text-transparent">
                  for Education & Growth
                </span>
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
              Manage institutes, consultancies, and companies — all from one powerful dashboard.
              Enroll students, track visas, post jobs, and scale your operations with advanced analytics.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
              {isAuthenticated ? (
                <Button size="lg" className="text-base px-8 h-12 rounded-xl shadow-lg shadow-primary/25" asChild>
                  <Link to="/dashboard">Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" /></Link>
                </Button>
              ) : (
                <Button size="lg" className="text-base px-8 h-12 rounded-xl shadow-lg shadow-primary/25" asChild>
                  <Link to="/login">Get Started Free <ArrowRight className="w-4 h-4 ml-2" /></Link>
                </Button>
              )}
              <Button size="lg" variant="outline" className="text-base px-8 h-12 rounded-xl" asChild>
                <Link to="/explore"><Globe className="w-4 h-4 mr-2" /> Explore Platform</Link>
              </Button>
            </motion.div>

            {/* Mini feature pills */}
            <motion.div variants={fadeUp} custom={4} className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {[
                { icon: GraduationCap, label: "Course Management" },
                { icon: Plane, label: "Visa Tracking" },
                { icon: Briefcase, label: "Job Placements" },
                { icon: BarChart3, label: "Analytics" },
                { icon: Shield, label: "Role-Based Access" },
              ].map(p => (
                <span key={p.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-medium text-muted-foreground shadow-sm">
                  <p.icon className="w-3 h-3 text-primary" /> {p.label}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ══════ STATS BAR ══════ */}
      <section className="relative z-10 -mt-8 sm:-mt-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="gradient-primary rounded-2xl p-6 sm:p-8 shadow-lg shadow-primary/20"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {stats.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className="text-center"
                >
                  <s.icon className="w-5 h-5 mx-auto mb-2 text-primary-foreground/70" />
                  <p className="font-display font-extrabold text-2xl sm:text-3xl text-primary-foreground">{s.value}</p>
                  <p className="text-xs text-primary-foreground/70 mt-0.5">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════ WHO IT'S FOR — Role Cards ══════ */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
          <motion.span variants={fadeUp} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-4">
            <Target className="w-3 h-3" /> Built For You
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">
            One Platform, Every Stakeholder
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
            Whether you run an institute, consultancy, or company — we've built dedicated tools just for your workflow.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {roleCards.map((card, i) => (
            <motion.div
              key={card.role}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
              className="group relative bg-card rounded-2xl border border-border p-6 sm:p-8 hover:shadow-elevated transition-all duration-300"
            >
              {/* Gradient accent top */}
              <div className={`absolute top-0 left-6 right-6 h-1 rounded-b-full bg-gradient-to-r ${card.color}`} />

              <div className={`w-14 h-14 rounded-2xl ${card.bgLight} flex items-center justify-center mb-5`}>
                <card.icon className={`w-7 h-7 ${card.textColor}`} />
              </div>

              <h3 className="font-display font-bold text-xl sm:text-2xl mb-1">{card.role}</h3>
              <p className="text-sm text-muted-foreground mb-6">{card.tagline}</p>

              <ul className="space-y-3">
                {card.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle className={`w-4 h-4 ${card.textColor} shrink-0 mt-0.5`} />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-5 border-t border-border">
                <Link to="/login" className={`inline-flex items-center gap-1.5 text-sm font-semibold ${card.textColor} group-hover:gap-2.5 transition-all`}>
                  Get started as {card.role.slice(0, -1) === "Companie" ? "Company" : card.role.slice(0, -3)}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════ FOR STUDENTS ══════ */}
      <section className="bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
                <Users className="w-3 h-3" /> For Students
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
                Everything You Need,<br />
                <span className="text-primary">In One Dashboard</span>
              </h2>
              <p className="text-muted-foreground text-base mb-8 leading-relaxed">
                Access your courses, test scores, attendance records, library resources, fee payments, visa status, and placement updates — all in one place, across all your registered organizations.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: GraduationCap, label: "My Courses" },
                  { icon: FileText, label: "Tests & Results" },
                  { icon: CalendarCheck, label: "Attendance" },
                  { icon: BookOpen, label: "Library" },
                  { icon: CreditCard, label: "Fee Payments" },
                  { icon: Plane, label: "Visa Status" },
                  { icon: Languages, label: "Language Courses" },
                  { icon: TrendingUp, label: "Progress Reports" },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2.5 p-3 rounded-xl bg-background border border-border">
                    <item.icon className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="relative"
            >
              {/* Mock dashboard preview */}
              <div className="bg-background rounded-2xl border border-border shadow-elevated p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-warning/60" />
                  <div className="w-3 h-3 rounded-full bg-accent/60" />
                  <div className="flex-1" />
                  <div className="w-20 h-2 rounded bg-muted" />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: "Avg Score", val: "87%", trend: "+5%" },
                    { label: "Attendance", val: "94%", trend: "+2%" },
                    { label: "Courses", val: "6", trend: "Active" },
                    { label: "Due Fees", val: "$250", trend: "Pending" },
                  ].map(s => (
                    <div key={s.label} className="p-3 rounded-xl bg-card border border-border">
                      <p className="text-[10px] text-muted-foreground mb-1">{s.label}</p>
                      <p className="font-display font-bold text-lg">{s.val}</p>
                      <p className="text-[10px] text-accent">{s.trend}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {["React & TypeScript — Module 5", "Data Science — Assignment Due", "IELTS Prep — Next Session"].map(item => (
                    <div key={item} className="flex items-center gap-2 p-2.5 rounded-lg bg-card border border-border">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-xs">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-xl shadow-lg shadow-primary/30 text-sm font-semibold flex items-center gap-2">
                <Award className="w-4 h-4" /> Student Dashboard
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════ PLATFORM FEATURES ══════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
          <motion.span variants={fadeUp} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning/10 text-warning text-xs font-semibold mb-4">
            <Zap className="w-3 h-3" /> Platform Power
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">
            Enterprise Features,<br />Zero Complexity
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
            Built with the tools and security that enterprise organizations demand, packaged in a UI anyone can use.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {platformFeatures.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="group bg-card rounded-2xl border border-border p-6 hover:border-primary/30 hover:shadow-elevated transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-base sm:text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════ HOW IT WORKS ══════ */}
      <section className="bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
            <motion.h2 variants={fadeUp} className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">
              Up & Running in Minutes
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg">
              No complex setup, no technical expertise required.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="relative text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground font-display font-extrabold text-xl mb-5 shadow-lg shadow-primary/20">
                  {step.step}
                </div>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] border-t-2 border-dashed border-primary/20" />
                )}
                <h4 className="font-display font-semibold text-base sm:text-lg mb-2">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ TESTIMONIALS ══════ */}
      <section id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
          <motion.span variants={fadeUp} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            <HeartHandshake className="w-3 h-3" /> Loved By Teams
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">
            What Our Users Say
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="bg-card rounded-2xl border border-border p-6 hover:shadow-elevated transition-shadow"
            >
              <div className="flex items-center gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-warning fill-warning" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-xs">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════ FAQ ══════ */}
      <section className="bg-card border-y border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
            <motion.h2 variants={fadeUp} className="font-display font-bold text-3xl sm:text-4xl mb-4">
              Frequently Asked Questions
            </motion.h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="group bg-background rounded-xl border border-border p-5 cursor-pointer"
              >
                <summary className="flex items-center justify-between font-display font-semibold text-sm sm:text-base list-none [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform shrink-0 ml-4" />
                </summary>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{faq.a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ FINAL CTA ══════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 gradient-primary opacity-[0.03]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center relative">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl mb-5">
              Ready to Transform<br />
              <span className="text-primary">Your Organization?</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground mb-10 max-w-xl mx-auto text-base sm:text-lg">
              Join hundreds of institutes, consultancies, and companies already managing
              everything from one platform. Start free — no credit card required.
            </motion.p>
            <motion.div variants={fadeUp} custom={2} className="flex flex-col sm:flex-row gap-3 justify-center">
              {isAuthenticated ? (
                <Button size="lg" className="text-base px-10 h-12 rounded-xl shadow-lg shadow-primary/25" asChild>
                  <Link to="/dashboard">Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" /></Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" className="text-base px-10 h-12 rounded-xl shadow-lg shadow-primary/25" asChild>
                    <Link to="/login"><LogIn className="w-4 h-4 mr-2" /> Start Free Today</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="text-base px-8 h-12 rounded-xl" asChild>
                    <Link to="/pricing"><CreditCard className="w-4 h-4 mr-2" /> View Plans</Link>
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-sm">EP</div>
                <span className="font-display font-bold text-lg">EduPlatform</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The all-in-one management platform for education, consultancy, and recruitment organizations.
              </p>
            </div>
            <div>
              <h4 className="font-display font-semibold text-sm mb-4">Platform</h4>
              <div className="space-y-2.5">
                <Link to="/#features" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link>
                <Link to="/pricing" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
                <Link to="/explore" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Explore</Link>
              </div>
            </div>
            <div>
              <h4 className="font-display font-semibold text-sm mb-4">Browse</h4>
              <div className="space-y-2.5">
                <Link to="/browse/institutes" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Institutes</Link>
                <Link to="/browse/consultancies" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Consultancies</Link>
                <Link to="/browse/jobs" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Job Board</Link>
              </div>
            </div>
            <div>
              <h4 className="font-display font-semibold text-sm mb-4">Company</h4>
              <div className="space-y-2.5">
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">© 2026 EduPlatform. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
