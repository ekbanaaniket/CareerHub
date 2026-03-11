import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, Eye, EyeOff, GraduationCap, Plane, Briefcase, Shield, ArrowRight, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { ROLE_CONFIGS, type AppRole } from "@/config/roles";

const DEMO_ACCOUNTS: { role: AppRole; label: string; email: string; desc: string; icon: typeof Shield }[] = [
  { role: "platform_owner", label: "Platform Owner", email: "john@platform.com", desc: "Full platform access", icon: Shield },
  { role: "institute_owner", label: "Institute Owner", email: "jane@techverse.com", desc: "Manage your institute", icon: GraduationCap },
  { role: "consultancy_owner", label: "Consultancy Owner", email: "ravi@globalconsult.com", desc: "Manage consultancy", icon: Plane },
  { role: "company", label: "Company", email: "hr@techcorp.com", desc: "Post jobs & recruit", icon: Briefcase },
  { role: "student", label: "Student", email: "alice@email.com", desc: "Learn & access resources", icon: GraduationCap },
];

export default function LoginPage() {
  const { login, switchRole } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    if (success) {
      toast.success("Welcome back!");
      navigate("/dashboard");
    } else {
      toast.error("Invalid credentials. Try a demo account below.");
    }
  };

  const handleDemoLogin = (role: AppRole) => {
    switchRole(role);
    toast.success(`Logged in as ${ROLE_CONFIGS[role].label}`);
    navigate("/dashboard");
  };


  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.08%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-primary-foreground">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center font-display font-bold text-lg">
                ED
              </div>
              <span className="font-display font-bold text-2xl">EduPlatform</span>
            </div>
            <h1 className="font-display font-extrabold text-4xl xl:text-5xl leading-tight mb-6">
              One Platform for<br />
              <span className="text-primary-foreground/80">Education, Consultancy</span><br />
              & Recruitment
            </h1>
            <p className="text-primary-foreground/70 text-lg mb-10 max-w-md">
              Manage institutes, consultancies, and companies with role-based access for every stakeholder.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: GraduationCap, label: "50+ Institutes", value: "10K+ Students" },
                { icon: Plane, label: "30+ Consultancies", value: "96% Success" },
                { icon: Briefcase, label: "100+ Companies", value: "5K+ Jobs" },
              ].map((stat) => (
                <div key={stat.label} className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4">
                  <stat.icon className="w-5 h-5 mb-2 text-primary-foreground/70" />
                  <p className="text-xs text-primary-foreground/60">{stat.label}</p>
                  <p className="font-display font-bold text-sm">{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-sm">ED</div>
            <span className="font-display font-bold text-lg">EduPlatform</span>
          </div>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="w-full mb-6">
              <TabsTrigger value="login" className="flex-1"><LogIn className="w-4 h-4 mr-1" /> Login</TabsTrigger>
              <TabsTrigger value="signup" className="flex-1"><UserPlus className="w-4 h-4 mr-1" /> Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <div className="space-y-6">
                <div>
                  <h2 className="font-display font-bold text-2xl mb-1">Welcome back</h2>
                  <p className="text-sm text-muted-foreground">Enter your credentials or use a demo account</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label>Email</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input type="email" placeholder="you@example.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                  </div>
                  <div>
                    <Label>Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10 pr-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
                      <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                  <div className="relative flex justify-center text-xs"><span className="bg-background px-2 text-muted-foreground">or try a demo account</span></div>
                </div>

                <div className="space-y-2">
                  {DEMO_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.role}
                      onClick={() => handleDemoLogin(acc.role)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-secondary/50 transition-colors text-left group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <acc.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{acc.label}</p>
                        <p className="text-[10px] text-muted-foreground">{acc.email}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="signup">
              <div className="space-y-6">
                <div>
                  <h2 className="font-display font-bold text-2xl mb-1">Register your organization</h2>
                  <p className="text-sm text-muted-foreground">Institutes, consultancies, and companies can self-register on the platform</p>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Institute", desc: "Manage students, courses, and academics", icon: GraduationCap, path: "/register" },
                    { label: "Consultancy", desc: "Help students with visa & university applications", icon: Plane, path: "/register" },
                    { label: "Company", desc: "Post jobs, manage applicants, recruit talent", icon: Briefcase, path: "/register" },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => navigate(item.path)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-secondary/50 transition-colors text-left group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Students can register through their institute's enrollment page
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <p className="text-center text-xs text-muted-foreground mt-6">
            <Link to="/" className="hover:text-primary transition-colors">← Back to Home</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
