// ============= Registration Page — Self-registration for Institutes, Consultancies, Companies =============
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Building2, Globe, Briefcase, ArrowLeft, CheckCircle, Send } from "lucide-react";
import { submitRegistration, REGISTRABLE_ROLES } from "@/services/registration";
import type { RegistrationRequest } from "@/services/registration";

const ENTITY_CONFIG = {
  institute: {
    icon: Building2,
    color: "bg-primary/10 text-primary",
    title: "Register Your Institute",
    description: "Join the platform to manage students, courses, and more",
    extraFields: ["teachingMode", "courses"],
  },
  consultancy: {
    icon: Globe,
    color: "bg-emerald-500/10 text-emerald-600",
    title: "Register Your Consultancy",
    description: "Help students with visa, university applications, and career guidance",
    extraFields: ["countries", "specializations"],
  },
  company: {
    icon: Briefcase,
    color: "bg-amber-500/10 text-amber-600",
    title: "Register Your Company",
    description: "Post jobs, manage applicants, and recruit talent",
    extraFields: ["industry"],
  },
};

type EntityType = RegistrationRequest["entityType"];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"choose" | "form" | "success">("choose");
  const [entityType, setEntityType] = useState<EntityType>("institute");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    website: "",
    description: "",
    ownerName: "",
    ownerEmail: "",
    industry: "",
    countries: "",
    specializations: "",
    teachingMode: "hybrid",
    courses: "",
  });

  const config = ENTITY_CONFIG[entityType];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.ownerName || !form.ownerEmail) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitRegistration({
        entityType,
        name: form.name,
        email: form.email,
        phone: form.phone,
        city: form.city,
        website: form.website,
        description: form.description,
        ownerName: form.ownerName,
        ownerEmail: form.ownerEmail,
        industry: form.industry || undefined,
        countries: form.countries ? form.countries.split(",").map((c) => c.trim()) : undefined,
        specializations: form.specializations ? form.specializations.split(",").map((s) => s.trim()) : undefined,
        teachingMode: form.teachingMode || undefined,
        courses: form.courses ? form.courses.split(",").map((c) => c.trim()) : undefined,
      });
      setStep("success");
    } catch {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h1 className="font-display font-bold text-2xl">Registration Submitted!</h1>
          <p className="text-muted-foreground">
            Your <span className="font-medium text-foreground">{entityType}</span> registration for{" "}
            <span className="font-medium text-foreground">{form.name}</span> has been submitted.
            The platform team will review and approve your application.
          </p>
          <p className="text-sm text-muted-foreground">
            You'll receive a notification at <span className="font-medium">{form.ownerEmail}</span> once approved.
          </p>
          <div className="flex gap-3 justify-center pt-4">
            <Button variant="outline" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
            </Button>
            <Button onClick={() => navigate("/login")}>
              Go to Login
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (step === "choose") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full space-y-8"
        >
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <h1 className="font-display font-bold text-3xl mb-2">Register on EduPlatform</h1>
            <p className="text-muted-foreground">Choose your entity type to get started. Your registration will be reviewed by the platform team.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {REGISTRABLE_ROLES.map((r) => {
              const cfg = ENTITY_CONFIG[r.entityType];
              const Icon = cfg.icon;
              return (
                <motion.button
                  key={r.entityType}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setEntityType(r.entityType); setStep("form"); }}
                  className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all text-left space-y-3"
                >
                  <div className={`w-12 h-12 rounded-xl ${cfg.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-semibold text-lg">{r.label}</h3>
                  <p className="text-sm text-muted-foreground">{cfg.description}</p>
                </motion.button>
              );
            })}
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>
        </motion.div>
      </div>
    );
  }

  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full space-y-6"
      >
        <div>
          <button
            onClick={() => setStep("choose")}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Change entity type
          </button>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${config.color} flex items-center justify-center`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl">{config.title}</h1>
              <p className="text-sm text-muted-foreground">{config.description}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>{entityType === "company" ? "Company" : entityType === "consultancy" ? "Consultancy" : "Institute"} Name *</Label>
              <Input className="mt-1" placeholder="Organization name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <Label>Organization Email *</Label>
              <Input className="mt-1" type="email" placeholder="admin@org.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <Label>Phone</Label>
              <Input className="mt-1" placeholder="+1 234-567-8900" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <Label>City</Label>
              <Input className="mt-1" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div>
              <Label>Website</Label>
              <Input className="mt-1" placeholder="org.com" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea className="mt-1" placeholder="Brief description of your organization..." rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          {/* Type-specific fields */}
          {entityType === "company" && (
            <div>
              <Label>Industry</Label>
              <Input className="mt-1" placeholder="Technology, Fintech, etc." value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
            </div>
          )}

          {entityType === "consultancy" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Countries (comma-separated)</Label>
                <Input className="mt-1" placeholder="US, UK, Canada" value={form.countries} onChange={(e) => setForm({ ...form, countries: e.target.value })} />
              </div>
              <div>
                <Label>Specializations</Label>
                <Input className="mt-1" placeholder="Student Visa, PR" value={form.specializations} onChange={(e) => setForm({ ...form, specializations: e.target.value })} />
              </div>
            </div>
          )}

          {entityType === "institute" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Teaching Mode</Label>
                <Select value={form.teachingMode} onValueChange={(v) => setForm({ ...form, teachingMode: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Courses (comma-separated)</Label>
                <Input className="mt-1" placeholder="Web Dev, Data Science" value={form.courses} onChange={(e) => setForm({ ...form, courses: e.target.value })} />
              </div>
            </div>
          )}

          <div className="border-t border-border pt-4 space-y-4">
            <p className="text-sm font-medium text-muted-foreground">Owner Details</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Your Name *</Label>
                <Input className="mt-1" placeholder="Full name" value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} required />
              </div>
              <div>
                <Label>Your Email *</Label>
                <Input className="mt-1" type="email" placeholder="you@email.com" value={form.ownerEmail} onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })} required />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <Send className="w-4 h-4 mr-1" />
            {isSubmitting ? "Submitting..." : "Submit Registration"}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}