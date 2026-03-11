import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Video, FileText, Search, Download, Eye, Clock, Star, Plus, Upload } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useCanManage } from "@/hooks/useCanManage";

const books = [
  { id: 1, title: "Clean Code", author: "Robert C. Martin", category: "Best Practices", available: true, rating: 4.8, borrowed: 12 },
  { id: 2, title: "JavaScript: The Good Parts", author: "Douglas Crockford", category: "JavaScript", available: true, rating: 4.5, borrowed: 25 },
  { id: 3, title: "Design Patterns", author: "Gang of Four", category: "Architecture", available: false, rating: 4.7, borrowed: 18 },
  { id: 4, title: "You Don't Know JS", author: "Kyle Simpson", category: "JavaScript", available: true, rating: 4.9, borrowed: 30 },
  { id: 5, title: "The Pragmatic Programmer", author: "Hunt & Thomas", category: "Best Practices", available: true, rating: 4.6, borrowed: 22 },
  { id: 6, title: "Eloquent JavaScript", author: "Marijn Haverbeke", category: "JavaScript", available: true, rating: 4.4, borrowed: 15 },
];

const materials = [
  { id: 1, title: "Week 1-4: HTML/CSS/JS Fundamentals", type: "PDF", size: "12.5 MB", uploads: "Jan 15, 2026", downloads: 145 },
  { id: 2, title: "Week 5-8: React & TypeScript Deep Dive", type: "PDF", size: "18.3 MB", uploads: "Feb 1, 2026", downloads: 120 },
  { id: 3, title: "Git Workflow Cheatsheet", type: "PDF", size: "2.1 MB", uploads: "Jan 20, 2026", downloads: 210 },
  { id: 4, title: "NestJS Architecture Guide", type: "PDF", size: "8.7 MB", uploads: "Feb 15, 2026", downloads: 85 },
  { id: 5, title: "Docker Basics Handbook", type: "PDF", size: "5.4 MB", uploads: "Feb 20, 2026", downloads: 95 },
];

export default function Library() {
  const { isViewOnly } = useCanManage();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("books");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Library"
        description="Books, study materials, and resources for students"
        actions={!isViewOnly ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Upload className="w-4 h-4 mr-1" /> Upload Material</Button>
            <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add Book</Button>
          </div>
        ) : undefined}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Books", value: "156", icon: BookOpen, color: "text-primary bg-primary/10" },
          { label: "Study Materials", value: "48", icon: FileText, color: "text-info bg-info/10" },
          { label: "Active Borrows", value: "34", icon: Clock, color: "text-warning bg-warning/10" },
          { label: "Total Downloads", value: "2.4K", icon: Download, color: "text-success bg-success/10" },
        ].map((s) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}>
              <s.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-lg font-bold font-display">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search + Tabs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search library..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="books"><BookOpen className="w-3.5 h-3.5 mr-1" />Books</TabsTrigger>
            <TabsTrigger value="materials"><FileText className="w-3.5 h-3.5 mr-1" />Materials</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      {tab === "books" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.filter(b => b.title.toLowerCase().includes(search.toLowerCase())).map((book) => (
            <motion.div key={book.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5 hover:shadow-elevated transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <StatusBadge variant={book.available ? "success" : "destructive"}>
                  {book.available ? "Available" : "Borrowed"}
                </StatusBadge>
              </div>
              <h3 className="text-sm font-semibold font-display mb-1">{book.title}</h3>
              <p className="text-xs text-muted-foreground mb-3">{book.author}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-warning fill-warning" /> {book.rating}</span>
                <span>{book.borrowed} borrows</span>
                <StatusBadge variant="outline">{book.category}</StatusBadge>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {materials.filter(m => m.title.toLowerCase().includes(search.toLowerCase())).map((m) => (
            <motion.div key={m.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-xl border border-border shadow-card p-4 flex items-center gap-4 hover:shadow-elevated transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-info" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{m.title}</p>
                <p className="text-xs text-muted-foreground">{m.type} • {m.size} • Uploaded {m.uploads}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Download className="w-3 h-3" /> {m.downloads}</span>
                <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5" /></Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
