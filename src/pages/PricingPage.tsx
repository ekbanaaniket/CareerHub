import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import PublicHeader from "@/components/layout/PublicHeader";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle, CreditCard, GraduationCap, Plane, Building2 } from "lucide-react";
import { ROLE_CONFIGS, type AppRole } from "@/config/roles";
import { toast } from "sonner";
import { useState } from "react";

const pricingPlans = [
  {
    name: "Institute",
    price: "$49",
    period: "/month",
    desc: "For educational institutes and academies",
    icon: GraduationCap,
    features: ["Unlimited courses", "Student management", "Test & assessment tools", "Attendance tracking", "Progress analytics", "Library management"],
    cta: "Register Institute",
    popular: false,
    role: "institute_owner" as AppRole,
  },
  {
    name: "Consultancy",
    price: "$39",
    period: "/month",
    desc: "For education & immigration consultancies",
    icon: Plane,
    features: ["Visa application tracking", "University admissions", "Counselor management", "Language course management", "Student pipeline", "Document management"],
    cta: "Register Consultancy",
    popular: true,
    role: "consultancy_owner" as AppRole,
  },
  {
    name: "Company",
    price: "$29",
    period: "/month",
    desc: "For recruiters and hiring companies",
    icon: Building2,
    features: ["Unlimited job postings", "Candidate pipeline", "Campus recruitment", "Placement tracking", "Analytics dashboard", "Priority support"],
    cta: "Register Company",
    popular: false,
    role: "company" as AppRole,
  },
];

export default function PricingPage() {
  const { switchRole } = useAuth();
  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = useState(false);

  const handleRegister = (role: AppRole) => {
    switchRole(role);
    toast.success(`Registered as ${ROLE_CONFIGS[role].label} — redirecting to dashboard`);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader onLoginClick={() => setLoginOpen(true)} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl mb-4">
              Choose Your Plan
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
              Register your organization and start managing everything from one platform.
              All plans include a 14-day free trial.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-xl border p-5 sm:p-6 flex flex-col ${
                plan.popular
                  ? "border-primary bg-primary/5 shadow-elevated relative"
                  : "border-border bg-card"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
                  Popular
                </span>
              )}
              <div className="mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <plan.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{plan.desc}</p>
              </div>
              <div className="mb-4">
                <span className="font-display font-extrabold text-3xl">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs sm:text-sm">
                    <CheckCircle className="w-3.5 h-3.5 text-success shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleRegister(plan.role)}
              >
                <CreditCard className="w-4 h-4 mr-1" /> {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            All plans include a <span className="font-semibold text-foreground">14-day free trial</span>. No credit card required to start.
          </p>
        </div>
      </section>

      <footer className="border-t border-border py-8">
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
