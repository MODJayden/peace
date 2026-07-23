import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, ImagePlus } from "lucide-react";
import api from "@/api/axiosInstance";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label, Select } from "@/components/ui/form-elements";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { EmptyState } from "@/components/common/EmptyState";
import { useDocumentHead } from "@/hooks/useDocumentHead";

const PLACEMENTS = ["home_hero", "sidebar", "in_article", "between_articles", "footer"];

const emptyForm = {
  title: "",
  advertiser: "",
  targetUrl: "",
  placement: "sidebar",
  startDate: "",
  endDate: "",
  budget: "",
  costPerClick: "",
};

export default function AdminAdvertisementsPage() {
  const [ads, setAds] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useDocumentHead({ title: "Manage Advertisements", noIndex: true });

  const loadAds = () => {
    api.get("/advertisements").then(({ data }) => setAds(data.data.results));
  };

  useEffect(loadAds, []);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleCreate = async () => {
    if (!form.title || !form.advertiser || !form.targetUrl || !imageFile) {
      toast.error("Title, advertiser, target URL, and creative image are required");
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      formData.append("image", imageFile);
      await api.post("/advertisements", formData);
      toast.success("Advertisement created");
      setOpen(false);
      setForm(emptyForm);
      setImageFile(null);
      loadAds();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not create advertisement");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this advertisement?")) return;
    await api.delete(`/advertisements/${id}`);
    toast.success("Advertisement deleted");
    loadAds();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Advertisements</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="accent">
              <Plus size={16} className="mr-1.5" /> New ad
            </Button>
          </DialogTrigger>
          <DialogContent title="Create Advertisement">
            <div className="space-y-3">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={form.title} onChange={handleChange("title")} />
              </div>
              <div>
                <Label htmlFor="advertiser">Advertiser</Label>
                <Input id="advertiser" value={form.advertiser} onChange={handleChange("advertiser")} />
              </div>
              <div>
                <Label htmlFor="targetUrl">Target URL</Label>
                <Input id="targetUrl" value={form.targetUrl} onChange={handleChange("targetUrl")} placeholder="https://" />
              </div>
              <div>
                <Label htmlFor="placement">Placement</Label>
                <Select id="placement" value={form.placement} onChange={handleChange("placement")}>
                  {PLACEMENTS.map((p) => (
                    <option key={p} value={p}>
                      {p.replace("_", " ")}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="startDate">Start date</Label>
                  <Input id="startDate" type="date" value={form.startDate} onChange={handleChange("startDate")} />
                </div>
                <div>
                  <Label htmlFor="endDate">End date</Label>
                  <Input id="endDate" type="date" value={form.endDate} onChange={handleChange("endDate")} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="budget">Budget (GHS)</Label>
                  <Input id="budget" type="number" value={form.budget} onChange={handleChange("budget")} />
                </div>
                <div>
                  <Label htmlFor="costPerClick">Cost per click (GHS)</Label>
                  <Input id="costPerClick" type="number" value={form.costPerClick} onChange={handleChange("costPerClick")} />
                </div>
              </div>
              <div>
                <Label>Creative image</Label>
                <label className="flex h-24 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-line-strong text-muted hover:border-accent">
                  {imageFile ? imageFile.name : <ImagePlus size={20} />}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0])} />
                </label>
              </div>
              <Button variant="accent" className="w-full" onClick={handleCreate} disabled={saving}>
                {saving ? "Creating..." : "Create advertisement"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 divide-y divide-line rounded-lg border border-line">
        {ads.length === 0 && (
          <EmptyState icon={ImagePlus} title="No advertisements" description="Create your first ad slot to start monetizing." />
        )}
        {ads.map((ad) => (
          <div key={ad._id} className="flex items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-3">
              {ad.image?.url && <img src={ad.image.url} alt={ad.title} className="h-12 w-20 rounded object-cover" />}
              <div>
                <p className="font-medium text-ink">{ad.title}</p>
                <p className="text-xs text-muted">
                  {ad.advertiser} &middot; {ad.placement.replace("_", " ")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={ad.status === "active" ? "accent" : "outline"}>{ad.status}</Badge>
              <div className="text-right text-xs text-muted">
                <p>{ad.impressions} impressions</p>
                <p>
                  {ad.clicks} clicks &middot; CTR {ad.ctr}%
                </p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(ad._id)}>
                <Trash2 size={15} className="text-breaking" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
