import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EntityGroupFilter, MOCK_INSTITUTES } from "@/components/common/EntityGroupFilter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, FileText, Search, Download, Star, Plus, Upload, Clock, Building2 } from "lucide-react";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useBooks, useMaterials, useCreateBook, useCreateMaterial } from "@/hooks/useLibrary";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { z } from "zod";
import { ReusableForm, FormInput, FormSelect } from "@/components/forms";

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  category: z.string().min(1, "Category is required"),
});

const materialSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.string().min(1, "Type is required"),
  size: z.string().min(1, "Size is required"),
});

export default function LibraryPage() {
  const { currentInstitute } = useApp();
  const { user } = useAuth();
  const isPlatformOwner = user?.role === "platform_owner";

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("books");
  const [addBookOpen, setAddBookOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [entityFilter, setEntityFilter] = useState("all");

  const instituteIdParam = isPlatformOwner
    ? (entityFilter !== "all" ? entityFilter : undefined)
    : currentInstitute.id;

  const { data: books, isLoading: booksLoading } = useBooks({ search, instituteId: instituteIdParam });
  const { data: materials, isLoading: materialsLoading } = useMaterials({ search, instituteId: instituteIdParam });
  const createBookMutation = useCreateBook();
  const createMaterialMutation = useCreateMaterial();

  // Group books by institute for platform owner
  const groupedBooks = useMemo(() => {
    if (!isPlatformOwner || !books || entityFilter !== "all") return null;
    const groups: Record<string, { instituteName: string; books: typeof books }> = {};
    for (const b of books) {
      const instId = b.instituteId ?? "unknown";
      const instName = MOCK_INSTITUTES.find((i) => i.id === instId)?.name ?? `Institute ${instId}`;
      if (!groups[instId]) groups[instId] = { instituteName: instName, books: [] };
      groups[instId].books.push(b);
    }
    return groups;
  }, [isPlatformOwner, books, entityFilter]);

  const handleAddBook = async (values: z.infer<typeof bookSchema>) => {
    try {
      await createBookMutation.mutateAsync({
        title: values.title, author: values.author, category: values.category,
        available: true, rating: 0, borrowed: 0, instituteId: currentInstitute.id,
      });
      toast.success("Book added successfully");
      setAddBookOpen(false);
    } catch { toast.error("Failed to add book"); }
  };

  const handleUploadMaterial = async (values: z.infer<typeof materialSchema>) => {
    try {
      await createMaterialMutation.mutateAsync({
        title: values.title, type: values.type, size: values.size,
        uploadDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        downloads: 0, instituteId: currentInstitute.id,
      });
      toast.success("Material uploaded successfully");
      setUploadOpen(false);
    } catch { toast.error("Failed to upload material"); }
  };

  const stats = [
    { label: "Total Books", value: String(books?.length ?? 0), icon: BookOpen, color: "text-primary bg-primary/10" },
    { label: "Study Materials", value: String(materials?.length ?? 0), icon: FileText, color: "text-info bg-info/10" },
    { label: "Active Borrows", value: String(books?.filter((b) => !b.available).length ?? 0), icon: Clock, color: "text-warning bg-warning/10" },
    { label: "Total Downloads", value: String(materials?.reduce((s, m) => s + m.downloads, 0) ?? 0), icon: Download, color: "text-success bg-success/10" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Library"
        description={isPlatformOwner ? "View all library resources across institutes" : "Books, study materials, and resources for students"}
        actions={
          !isPlatformOwner ? (
            <div className="flex gap-2">
              <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                <DialogTrigger asChild><Button variant="outline" size="sm"><Upload className="w-4 h-4 mr-1" /> Upload Material</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle className="font-display">Upload Study Material</DialogTitle></DialogHeader>
                  <ReusableForm schema={materialSchema} defaultValues={{ title: "", type: "PDF", size: "" }} onSubmit={handleUploadMaterial} submitLabel="Upload" isLoading={createMaterialMutation.isPending}>
                    {(form) => (
                      <>
                        <FormInput form={form} name="title" label="Title" placeholder="Week 9: State Management Guide" />
                        <div className="grid grid-cols-2 gap-4">
                          <FormSelect form={form} name="type" label="Type" options={[
                            { value: "PDF", label: "PDF" }, { value: "Video", label: "Video" }, { value: "Slides", label: "Slides" }, { value: "Code", label: "Code" },
                          ]} />
                          <FormInput form={form} name="size" label="Size" placeholder="5.4 MB" />
                        </div>
                      </>
                    )}
                  </ReusableForm>
                </DialogContent>
              </Dialog>
              <Dialog open={addBookOpen} onOpenChange={setAddBookOpen}>
                <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add Book</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle className="font-display">Add New Book</DialogTitle></DialogHeader>
                  <ReusableForm schema={bookSchema} defaultValues={{ title: "", author: "", category: "" }} onSubmit={handleAddBook} submitLabel="Add Book" isLoading={createBookMutation.isPending}>
                    {(form) => (
                      <>
                        <FormInput form={form} name="title" label="Title" placeholder="Clean Code" />
                        <FormInput form={form} name="author" label="Author" placeholder="Robert C. Martin" />
                        <FormSelect form={form} name="category" label="Category" options={[
                          { value: "JavaScript", label: "JavaScript" }, { value: "Best Practices", label: "Best Practices" },
                          { value: "Architecture", label: "Architecture" }, { value: "DevOps", label: "DevOps" },
                          { value: "Database", label: "Database" }, { value: "Other", label: "Other" },
                        ]} />
                      </>
                    )}
                  </ReusableForm>
                </DialogContent>
              </Dialog>
            </div>
          ) : undefined
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}><s.icon className="w-4 h-4" /></div>
            <div>
              <p className="text-lg font-bold font-display">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {isPlatformOwner && (
          <EntityGroupFilter label="Institutes" entities={MOCK_INSTITUTES} selected={entityFilter} onSelect={setEntityFilter} />
        )}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search library..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="books"><BookOpen className="w-3.5 h-3.5 mr-1" />Books</TabsTrigger>
            <TabsTrigger value="materials"><FileText className="w-3.5 h-3.5 mr-1" />Materials</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {tab === "books" ? (
        booksLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
          </div>
        ) : isPlatformOwner && groupedBooks ? (
          <div className="space-y-6">
            {Object.entries(groupedBooks).map(([instId, group]) => (
              <div key={instId} className="space-y-3">
                <h3 className="text-sm font-semibold font-display flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                  <Building2 className="w-4 h-4 text-primary" />
                  {group.instituteName}
                  <span className="text-xs font-normal">({group.books.length} books)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.books.map((book) => (
                    <motion.div key={book.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5 hover:shadow-elevated transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><BookOpen className="w-5 h-5 text-primary" /></div>
                        <StatusBadge variant={book.available ? "success" : "destructive"}>{book.available ? "Available" : "Borrowed"}</StatusBadge>
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
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {books?.map((book) => (
              <motion.div key={book.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-5 hover:shadow-elevated transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><BookOpen className="w-5 h-5 text-primary" /></div>
                  <StatusBadge variant={book.available ? "success" : "destructive"}>{book.available ? "Available" : "Borrowed"}</StatusBadge>
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
            {(!books || books.length === 0) && (
              <div className="col-span-3 text-center py-12 text-muted-foreground text-sm">No books found</div>
            )}
          </div>
        )
      ) : (
        materialsLoading ? (
          <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
        ) : (
          <div className="space-y-3">
            {materials?.map((m) => (
              <motion.div key={m.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-xl border border-border shadow-card p-4 flex items-center gap-4 hover:shadow-elevated transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center shrink-0"><FileText className="w-5 h-5 text-info" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{m.title}</p>
                  <p className="text-xs text-muted-foreground">{m.type} • {m.size} • Uploaded {m.uploadDate}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Download className="w-3 h-3" /> {m.downloads}</span>
                  <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5" /></Button>
                </div>
              </motion.div>
            ))}
            {(!materials || materials.length === 0) && (
              <div className="text-center py-12 text-muted-foreground text-sm">No materials found</div>
            )}
          </div>
        )
      )}
    </div>
  );
}
