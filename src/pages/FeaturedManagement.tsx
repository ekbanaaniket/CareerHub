// ============= Featured Management Page =============
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFeaturedEntities, useToggleFeatured, useUpdateFeaturedBadge } from "@/hooks/useFeatured";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";
import { Star, Building2, Globe, Briefcase, Award, GripVertical, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const ENTITY_TYPE_CONFIG: Record<string, { icon: typeof Building2; label: string; color: string }> = {
  institute: { icon: Building2, label: "Institute", color: "text-primary" },
  consultancy: { icon: Globe, label: "Consultancy", color: "text-warning" },
  company: { icon: Briefcase, label: "Company", color: "text-success" },
};

export default function FeaturedManagement() {
  const [typeFilter, setTypeFilter] = useState("all");
  const { data: entities, isLoading } = useFeaturedEntities(typeFilter);
  const toggleMutation = useToggleFeatured();
  const badgeMutation = useUpdateFeaturedBadge();
  const [editBadge, setEditBadge] = useState<{ id: string; badge: string } | null>(null);

  const handleToggle = (id: string, featured: boolean) => {
    toggleMutation.mutate({ id, featured }, {
      onSuccess: () => toast.success(featured ? "Entity featured" : "Entity unfeatured"),
      onError: () => toast.error("Failed to update"),
    });
  };

  const handleBadgeSave = () => {
    if (!editBadge) return;
    badgeMutation.mutate({ id: editBadge.id, badge: editBadge.badge }, {
      onSuccess: () => { toast.success("Badge updated"); setEditBadge(null); },
      onError: () => toast.error("Failed to update badge"),
    });
  };

  const featured = entities?.filter((e) => e.featured) ?? [];
  const unfeatured = entities?.filter((e) => !e.featured) ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Featured Management"
        description="Control which institutes, consultancies, and companies are featured on public pages"
      />

      <Tabs value={typeFilter} onValueChange={setTypeFilter}>
        <TabsList>
          <TabsTrigger value="all"><Star className="w-3.5 h-3.5 mr-1" />All</TabsTrigger>
          <TabsTrigger value="institute"><Building2 className="w-3.5 h-3.5 mr-1" />Institutes</TabsTrigger>
          <TabsTrigger value="consultancy"><Globe className="w-3.5 h-3.5 mr-1" />Consultancies</TabsTrigger>
          <TabsTrigger value="company"><Briefcase className="w-3.5 h-3.5 mr-1" />Companies</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      ) : (
        <>
          {/* Featured */}
          {featured.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold font-display flex items-center gap-2"><Star className="w-4 h-4 text-warning fill-warning" /> Featured ({featured.length})</h3>
              {featured.map((entity) => {
                const cfg = ENTITY_TYPE_CONFIG[entity.entityType];
                return (
                  <motion.div key={entity.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border-2 border-warning/30 shadow-card p-4">
                    <div className="flex items-center gap-4">
                      <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab shrink-0" />
                      <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-xs shrink-0">{entity.logo}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">{entity.name}</p>
                          <StatusBadge variant="warning">{cfg.label}</StatusBadge>
                          {entity.badge && <StatusBadge variant="outline"><Award className="w-3 h-3 mr-0.5" />{entity.badge}</StatusBadge>}
                        </div>
                        <p className="text-xs text-muted-foreground">{entity.description}</p>
                        {entity.featuredAt && <p className="text-[10px] text-muted-foreground mt-0.5">Featured since {entity.featuredAt}</p>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button variant="ghost" size="sm" onClick={() => setEditBadge({ id: entity.id, badge: entity.badge ?? "" })}><Edit className="w-3.5 h-3.5" /></Button>
                        <Switch checked={true} onCheckedChange={() => handleToggle(entity.id, false)} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Unfeatured */}
          {unfeatured.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold font-display text-muted-foreground">Available ({unfeatured.length})</h3>
              {unfeatured.map((entity) => {
                const cfg = ENTITY_TYPE_CONFIG[entity.entityType];
                return (
                  <motion.div key={entity.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border shadow-card p-4 opacity-75 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center font-display font-bold text-xs text-muted-foreground shrink-0">{entity.logo}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">{entity.name}</p>
                          <StatusBadge variant="outline">{cfg.label}</StatusBadge>
                        </div>
                        <p className="text-xs text-muted-foreground">{entity.description}</p>
                      </div>
                      <Switch checked={false} onCheckedChange={() => handleToggle(entity.id, true)} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Badge Edit Dialog */}
      <Dialog open={!!editBadge} onOpenChange={(open) => !open && setEditBadge(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Edit Featured Badge</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div><Label>Badge Text</Label><Input placeholder="e.g., Top Rated, Rising Star" className="mt-1" value={editBadge?.badge ?? ""} onChange={(e) => setEditBadge(editBadge ? { ...editBadge, badge: e.target.value } : null)} /></div>
            <Button className="w-full" onClick={handleBadgeSave} disabled={badgeMutation.isPending}>Save Badge</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
