import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Megaphone, Plus, Pin, Edit, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAnnouncements, useCreateAnnouncement, useUpdateAnnouncement, useDeleteAnnouncement } from "@/hooks/useAnnouncements";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { z } from "zod";
import { ReusableForm, FormInput, FormTextarea, FormSelect } from "@/components/forms";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { Announcement } from "@/types";
import { useCanManageAnnouncements } from "@/hooks/useCanManage";

const announcementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  priority: z.string().default("medium"),
  status: z.string().default("draft"),
});

type AnnouncementFormValues = z.infer<typeof announcementSchema>;

const priorityColors: Record<string, string> = {
  low: "outline",
  medium: "default",
  high: "warning",
  urgent: "destructive",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function AnnouncementsPage() {
  const { currentInstitute } = useApp();
  const { user } = useAuth();
  const { canCreate, canDelete } = useCanManageAnnouncements();
  const [createOpen, setCreateOpen] = useState(false);
  const [viewAnnouncement, setViewAnnouncement] = useState<Announcement | null>(null);

  const { data: announcements, isLoading } = useAnnouncements(currentInstitute.id);
  const createMutation = useCreateAnnouncement();
  const deleteMutation = useDeleteAnnouncement();
  const updateMutation = useUpdateAnnouncement();

  const handleCreate = async (values: AnnouncementFormValues) => {
    try {
      await createMutation.mutateAsync({
        title: values.title!,
        content: values.content!,
        priority: values.priority as Announcement["priority"],
        status: values.status as Announcement["status"],
        author: user?.name ?? "Unknown",
        authorRole: user?.role ?? "unknown",
        instituteId: currentInstitute.id,
        targetRoles: ["instructor", "student", "admin"],
        createdAt: new Date().toISOString(),
        pinned: false,
      });
      toast.success("Announcement created");
      setCreateOpen(false);
    } catch {
      toast.error("Failed to create announcement");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Announcement deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleTogglePin = async (a: Announcement) => {
    await updateMutation.mutateAsync({ id: a.id, data: { pinned: !a.pinned } });
  };

  const handlePublish = async (a: Announcement) => {
    await updateMutation.mutateAsync({ id: a.id, data: { status: "published" } });
    toast.success("Announcement published");
  };

  const sorted = announcements?.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        description={canCreate ? "Post and manage announcements" : "View announcements"}
        actions={
          canCreate ? (
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="w-4 h-4 mr-1" /> New Announcement</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle className="font-display">Create Announcement</DialogTitle></DialogHeader>
                <ReusableForm
                  schema={announcementSchema}
                  defaultValues={{ title: "", content: "", priority: "medium", status: "draft" }}
                  onSubmit={handleCreate}
                  submitLabel="Create"
                  isLoading={createMutation.isPending}
                >
                  {(form) => (
                    <>
                      <FormInput form={form} name="title" label="Title" placeholder="Announcement title" />
                      <FormTextarea form={form} name="content" label="Content" placeholder="Write your announcement..." />
                      <FormSelect form={form} name="priority" label="Priority" options={[
                        { label: "Low", value: "low" }, { label: "Medium", value: "medium" },
                        { label: "High", value: "high" }, { label: "Urgent", value: "urgent" },
                      ]} />
                      <FormSelect form={form} name="status" label="Status" options={[
                        { label: "Draft", value: "draft" }, { label: "Published", value: "published" },
                      ]} />
                    </>
                  )}
                </ReusableForm>
              </DialogContent>
            </Dialog>
          ) : undefined
        }
      />

      {/* View Dialog */}
      <Dialog open={!!viewAnnouncement} onOpenChange={(o) => !o && setViewAnnouncement(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">{viewAnnouncement?.title}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <StatusBadge variant={priorityColors[viewAnnouncement?.priority ?? "medium"] as any}>{viewAnnouncement?.priority}</StatusBadge>
              <StatusBadge variant={viewAnnouncement?.status === "published" ? "success" : "outline"}>{viewAnnouncement?.status}</StatusBadge>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{viewAnnouncement?.content}</p>
            <div className="text-xs text-muted-foreground">
              By {viewAnnouncement?.author} ({viewAnnouncement?.authorRole}) • {viewAnnouncement?.createdAt ? timeAgo(viewAnnouncement.createdAt) : ""}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
        ) : (
          sorted?.map((a) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border shadow-card p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    {a.pinned ? <Pin className="w-5 h-5 text-primary" /> : <Megaphone className="w-5 h-5 text-primary" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold font-display">{a.title}</h3>
                      <StatusBadge variant={priorityColors[a.priority] as any}>{a.priority}</StatusBadge>
                      <StatusBadge variant={a.status === "published" ? "success" : "outline"}>{a.status}</StatusBadge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{a.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      By {a.author} • {timeAgo(a.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setViewAnnouncement(a)}>
                    <Eye className="w-3.5 h-3.5" />
                  </Button>
                  {canCreate && (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => handleTogglePin(a)}>
                        <Pin className={`w-3.5 h-3.5 ${a.pinned ? "text-primary" : ""}`} />
                      </Button>
                      {a.status === "draft" && (
                        <Button variant="ghost" size="sm" onClick={() => handlePublish(a)}>Publish</Button>
                      )}
                      {canDelete && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
                              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(a.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
