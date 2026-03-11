import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  NavigationMenu, NavigationMenuContent, NavigationMenuItem,
  NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import {
  Menu, LogOut, LogIn, ArrowRight, GraduationCap, Plane, Briefcase, CreditCard
} from "lucide-react";

interface PublicHeaderProps {
  onLoginClick?: () => void;
}

const browseLinks = [
  { label: "Institutes", href: "/browse/institutes", desc: "Browse registered academies & schools", icon: GraduationCap },
  { label: "Consultancies", href: "/browse/consultancies", desc: "Find visa & education consultancies", icon: Plane },
  { label: "Job Board", href: "/browse/jobs", desc: "View open vacancies & apply", icon: Briefcase },
];

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Testimonials", href: "/#testimonials" },
];

export default function PublicHeader({ onLoginClick }: PublicHeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-sm">
            ED
          </div>
          <span className="font-display font-bold text-lg">EduPlatform</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <a key={l.label} href={l.href} className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md">
              {l.label}
            </a>
          ))}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm text-muted-foreground bg-transparent hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
                  Browse
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-1 p-2">
                    {browseLinks.map((bl) => (
                      <li key={bl.label}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={bl.href}
                            className="flex items-start gap-3 select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <bl.icon className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                            <div>
                              <div className="text-sm font-medium leading-none">{bl.label}</div>
                              <p className="line-clamp-1 text-xs leading-snug text-muted-foreground mt-1">{bl.desc}</p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <Link to="/pricing" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Hi, <span className="font-medium text-foreground">{user?.name}</span>
              </span>
              <Button size="sm" asChild>
                <Link to="/dashboard">Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1" /></Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button size="sm" className="hidden sm:inline-flex" asChild>
              <Link to="/login"><LogIn className="w-4 h-4 mr-1" /> Login</Link>
            </Button>
          )}

          {/* Mobile Nav */}
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-xs">ED</div>
                    <span className="font-display font-bold">EduPlatform</span>
                  </div>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                  {navLinks.map((l) => (
                    <a key={l.label} href={l.href} onClick={() => setMobileNavOpen(false)} className="block px-3 py-2.5 text-sm rounded-lg hover:bg-secondary transition-colors">
                      {l.label}
                    </a>
                  ))}
                  <Link to="/pricing" onClick={() => setMobileNavOpen(false)} className="block px-3 py-2.5 text-sm rounded-lg hover:bg-secondary transition-colors">
                    Pricing
                  </Link>
                  <div className="pt-2 pb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Browse</div>
                  {browseLinks.map((bl) => (
                    <Link key={bl.label} to={bl.href} onClick={() => setMobileNavOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg hover:bg-secondary transition-colors">
                      <bl.icon className="w-3.5 h-3.5 text-muted-foreground" />
                      {bl.label}
                    </Link>
                  ))}
                </nav>
                <div className="p-4 border-t border-border space-y-2">
                  {isAuthenticated ? (
                    <>
                      <Button className="w-full" size="sm" asChild>
                        <Link to="/dashboard" onClick={() => setMobileNavOpen(false)}>Dashboard</Link>
                      </Button>
                      <Button variant="outline" className="w-full" size="sm" onClick={() => { handleLogout(); setMobileNavOpen(false); }}>
                        <LogOut className="w-4 h-4 mr-1" /> Logout
                      </Button>
                    </>
                  ) : (
                    <Button className="w-full" size="sm" asChild>
                      <Link to="/login" onClick={() => setMobileNavOpen(false)}><LogIn className="w-4 h-4 mr-1" /> Login</Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
