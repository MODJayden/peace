import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { fetchSiteSettings, updateSiteSettings } from "@/features/admin/adminSlice";
import { Input } from "@/components/ui/input";
import { Label, Textarea } from "@/components/ui/form-elements";
import { Button } from "@/components/ui/button";
import { useDocumentHead } from "@/hooks/useDocumentHead";

export default function AdminSettingsPage() {
  const dispatch = useDispatch();
  const { siteSettings } = useSelector((state) => state.admin);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useDocumentHead({ title: "Site Settings", noIndex: true });

  useEffect(() => {
    dispatch(fetchSiteSettings());
  }, [dispatch]);

  useEffect(() => {
    if (siteSettings) {
      setForm({
        siteName: siteSettings.siteName,
        tagline: siteSettings.tagline,
        contactEmail: siteSettings.contactEmail,
        contactPhone: siteSettings.contactPhone,
        adSenseClientId: siteSettings.adSenseClientId,
        googleAnalyticsId: siteSettings.googleAnalyticsId,
        metaDescription: siteSettings.seoDefaults?.metaDescription || "",
      });
    }
  }, [siteSettings]);

  if (!form) return null;

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await dispatch(
        updateSiteSettings({
          siteName: form.siteName,
          tagline: form.tagline,
          contactEmail: form.contactEmail,
          contactPhone: form.contactPhone,
          adSenseClientId: form.adSenseClientId,
          googleAnalyticsId: form.googleAnalyticsId,
          seoDefaults: { metaDescription: form.metaDescription },
        })
      ).unwrap();
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err || "Could not save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-ink">Site Settings</h1>

      <div className="mt-6 space-y-4">
        <div>
          <Label htmlFor="siteName">Site name</Label>
          <Input id="siteName" value={form.siteName} onChange={handleChange("siteName")} />
        </div>
        <div>
          <Label htmlFor="tagline">Tagline</Label>
          <Input id="tagline" value={form.tagline} onChange={handleChange("tagline")} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contactEmail">Contact email</Label>
            <Input id="contactEmail" type="email" value={form.contactEmail} onChange={handleChange("contactEmail")} />
          </div>
          <div>
            <Label htmlFor="contactPhone">Contact phone</Label>
            <Input id="contactPhone" value={form.contactPhone} onChange={handleChange("contactPhone")} />
          </div>
        </div>
        <div>
          <Label htmlFor="metaDescription">Default meta description</Label>
          <Textarea id="metaDescription" value={form.metaDescription} onChange={handleChange("metaDescription")} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="adSenseClientId">Google AdSense client ID</Label>
            <Input id="adSenseClientId" value={form.adSenseClientId} onChange={handleChange("adSenseClientId")} placeholder="ca-pub-xxxxxxxxxxxx" />
          </div>
          <div>
            <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
            <Input id="googleAnalyticsId" value={form.googleAnalyticsId} onChange={handleChange("googleAnalyticsId")} placeholder="G-XXXXXXXXXX" />
          </div>
        </div>

        <Button variant="accent" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save settings"}
        </Button>
      </div>
    </div>
  );
}
