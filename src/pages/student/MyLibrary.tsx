// ============= Student: My Library (Grouped by Institute) =============
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EntityGroupCard, EntityGroupSkeleton, LazyItemList, type EntityGroupInfo } from "@/components/common/EntityGroupCard";
import { useStudentInstitutes } from "@/hooks/useStudentData";
import { useQuery } from "@tanstack/react-query";
import { mockApiCall } from "@/services/api";
import { BookOpen, Search, Star, Download, FileText } from "lucide-react";
import { useState, useMemo } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import type { ApiResponse } from "@/types";

interface LibraryBook {
  id: number; title: string; author: string; category: string; rating: number;
  borrowed: boolean; dueDate?: string; instituteId: string; instituteName: string;
}

interface LibraryMaterial {
  id: number; title: string; type: string; size: string;
  instituteId: string; instituteName: string;
}

interface StudentLibraryData {
  books: LibraryBook[];
  materials: LibraryMaterial[];
}

const mockLibrary: StudentLibraryData = {
  books: [
    { id: 1, title: "Clean Code", author: "Robert C. Martin", category: "Best Practices", rating: 4.8, borrowed: true, dueDate: "Mar 15, 2026", instituteId: "1", instituteName: "TechVerse Academy" },
    { id: 2, title: "JavaScript: The Good Parts", author: "Douglas Crockford", category: "JavaScript", rating: 4.5, borrowed: false, instituteId: "1", instituteName: "TechVerse Academy" },
    { id: 3, title: "You Don't Know JS", author: "Kyle Simpson", category: "JavaScript", rating: 4.9, borrowed: true, dueDate: "Mar 20, 2026", instituteId: "1", instituteName: "TechVerse Academy" },
    { id: 4, title: "React Patterns", author: "Michael Chan", category: "React", rating: 4.3, borrowed: false, instituteId: "2", instituteName: "CodeCraft Institute" },
    { id: 5, title: "Design Patterns", author: "Gang of Four", category: "Software Engineering", rating: 4.7, borrowed: false, instituteId: "2", instituteName: "CodeCraft Institute" },
  ],
  materials: [
    { id: 1, title: "Week 1-4: HTML/CSS/JS Fundamentals", type: "PDF", size: "12.5 MB", instituteId: "1", instituteName: "TechVerse Academy" },
    { id: 2, title: "Week 5-8: React & TypeScript Deep Dive", type: "PDF", size: "18.3 MB", instituteId: "1", instituteName: "TechVerse Academy" },
    { id: 3, title: "React Advanced Patterns Guide", type: "PDF", size: "8.2 MB", instituteId: "2", instituteName: "CodeCraft Institute" },
  ],
};

async function fetchStudentLibrary(): Promise<ApiResponse<StudentLibraryData>> {
  return mockApiCall({ data: mockLibrary });
}

export default function MyLibrary() {
  const { data: library, isLoading } = useQuery({
    queryKey: ["studentLibrary"],
    queryFn: fetchStudentLibrary,
    select: (res) => res.data,
  });
  const { data: institutes } = useStudentInstitutes();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("books");

  const groupedBooks = useMemo(() => {
    if (!library) return {};
    const q = search.toLowerCase();
    return library.books
      .filter(b => !search || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))
      .reduce((acc, b) => {
        if (!acc[b.instituteId]) acc[b.instituteId] = { instituteName: b.instituteName, items: [] };
        acc[b.instituteId].items.push(b);
        return acc;
      }, {} as Record<string, { instituteName: string; items: LibraryBook[] }>);
  }, [library, search]);

  const groupedMaterials = useMemo(() => {
    if (!library) return {};
    const q = search.toLowerCase();
    return library.materials
      .filter(m => !search || m.title.toLowerCase().includes(q))
      .reduce((acc, m) => {
        if (!acc[m.instituteId]) acc[m.instituteId] = { instituteName: m.instituteName, items: [] };
        acc[m.instituteId].items.push(m);
        return acc;
      }, {} as Record<string, { instituteName: string; items: LibraryMaterial[] }>);
  }, [library, search]);

  if (isLoading || !library) return <EntityGroupSkeleton count={2} />;

  return (
    <div className="space-y-6">
      <PageHeader title="My Library" description="Books and materials from enrolled institutes" />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search library..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Tabs.Root value={tab} onValueChange={setTab}>
          <Tabs.List className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
            <Tabs.Trigger value="books" className="inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              <BookOpen className="w-3.5 h-3.5" />Books
            </Tabs.Trigger>
            <Tabs.Trigger value="materials" className="inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              <FileText className="w-3.5 h-3.5" />Materials
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      </div>

      {tab === "books" ? (
        <div className="space-y-4">
          {Object.entries(groupedBooks).map(([instId, group]) => {
            const inst = institutes?.find(i => i.id === instId);
            const entity: EntityGroupInfo = {
              id: instId, name: group.instituteName, type: "institute",
              logo: inst?.logo ?? "IN", subtitle: inst?.location,
              meta: [{ label: "Books", value: group.items.length }],
            };
            return (
              <EntityGroupCard key={instId} entity={entity}>
                <LazyItemList
                  items={group.items}
                  initialCount={4}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                  renderItem={(book) => (
                    <div key={book.id} className="bg-secondary/30 rounded-lg border border-border p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-primary" />
                        </div>
                        <StatusBadge variant={book.borrowed ? "warning" : "success"}>
                          {book.borrowed ? "Borrowed" : "Available"}
                        </StatusBadge>
                      </div>
                      <h3 className="text-sm font-semibold font-display mb-0.5">{book.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{book.author}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-warning fill-warning" /> {book.rating}</span>
                        {book.dueDate && <span>Due: {book.dueDate}</span>}
                      </div>
                    </div>
                  )}
                />
              </EntityGroupCard>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedMaterials).map(([instId, group]) => {
            const inst = institutes?.find(i => i.id === instId);
            const entity: EntityGroupInfo = {
              id: instId, name: group.instituteName, type: "institute",
              logo: inst?.logo ?? "IN", subtitle: inst?.location,
              meta: [{ label: "Materials", value: group.items.length }],
            };
            return (
              <EntityGroupCard key={instId} entity={entity}>
                <LazyItemList
                  items={group.items}
                  initialCount={4}
                  renderItem={(m) => (
                    <div key={m.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 border border-border">
                      <div className="w-9 h-9 rounded-lg bg-info/10 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-info" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{m.title}</p>
                        <p className="text-xs text-muted-foreground">{m.type} · {m.size}</p>
                      </div>
                      <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5" /></Button>
                    </div>
                  )}
                />
              </EntityGroupCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
