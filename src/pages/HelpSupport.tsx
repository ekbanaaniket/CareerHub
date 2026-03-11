// ============= Help & Support Page =============
import { PageHeader } from "@/components/common/PageHeader";
import { motion } from "framer-motion";
import {
  HelpCircle, BookOpen, MessageCircle, Mail, Phone,
  FileText, ExternalLink, ChevronRight, Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const faqs = [
  { q: "How do I create a new course?", a: "Navigate to Courses from the sidebar, click 'Create Course', fill in the details including modules, schedule, and assign an instructor." },
  { q: "How do I manage student enrollment?", a: "Go to Enrollment page, select a course, and use the 'Enroll Students' button. You can bulk enroll from CSV or add individually." },
  { q: "How do permissions work?", a: "Roles & Permissions page lets you create custom roles with granular access control. Platform owners can manage all entities, while institute owners manage their own." },
  { q: "How do I post a job vacancy?", a: "Company users can navigate to Job Board and click 'Post Vacancy'. Fill in job details, skills, salary range, and deadline." },
  { q: "How do I track visa applications?", a: "Consultancy owners and counselors can use the Visa Tracking section to manage applications, upload documents, and track status." },
  { q: "How do I change my subscription plan?", a: "Go to Settings > Subscription tab to view your current plan and upgrade options." },
];

const resources = [
  { title: "Getting Started Guide", desc: "Learn the basics of setting up your organization", icon: BookOpen },
  { title: "API Documentation", desc: "Technical reference for platform integrations", icon: FileText },
  { title: "Video Tutorials", desc: "Step-by-step walkthrough videos", icon: ExternalLink },
  { title: "Best Practices", desc: "Tips for managing your platform efficiently", icon: ChevronRight },
];

export default function HelpSupport() {
  const [search, setSearch] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const filteredFaqs = faqs.filter(
    (faq) => !search || faq.q.toLowerCase().includes(search.toLowerCase()) || faq.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Help & Support" description="Find answers, resources, and contact support" />

      {/* Search */}
      <div className="relative max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search help articles..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-sm font-semibold font-display flex items-center gap-2"><HelpCircle className="w-4 h-4 text-primary" /> Frequently Asked Questions</h3>
          {filteredFaqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
              <button className="w-full p-4 text-left flex items-center justify-between" onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}>
                <p className="text-sm font-medium">{faq.q}</p>
                <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${expandedFaq === i ? "rotate-90" : ""}`} />
              </button>
              {expandedFaq === i && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Contact */}
          <div className="bg-card rounded-xl border border-border shadow-card p-5">
            <h3 className="text-sm font-semibold font-display mb-4 flex items-center gap-2"><MessageCircle className="w-4 h-4 text-primary" /> Contact Support</h3>
            <div className="space-y-3">
              <a href="mailto:support@eduplatform.com" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary transition-colors">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-xs text-muted-foreground">support@eduplatform.com</p>
                </div>
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary transition-colors">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-xs text-muted-foreground">+1 (234) 567-890</p>
                </div>
              </a>
            </div>
          </div>

          {/* Resources */}
          <div className="bg-card rounded-xl border border-border shadow-card p-5">
            <h3 className="text-sm font-semibold font-display mb-4 flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary" /> Resources</h3>
            <div className="space-y-2">
              {resources.map((r, i) => (
                <button key={i} className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary transition-colors text-left">
                  <r.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{r.title}</p>
                    <p className="text-[10px] text-muted-foreground">{r.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
