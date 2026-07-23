import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { ImagePlus } from "lucide-react";
import api from "@/api/axiosInstance";
import { createArticle, updateArticle, uploadFeaturedImage } from "@/features/articles/articleSlice";
import { fetchCategories } from "@/features/categories/categorySlice";
import { Input } from "@/components/ui/input";
import { Textarea, Label, Select } from "@/components/ui/form-elements";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/article/RichTextEditor";
import { useDocumentHead } from "@/hooks/useDocumentHead";

export default function ArticleEditorPage() {
  const { id } = useParams();
  const isEditing = !!id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector((state) => state.categories.list);

  useDocumentHead({ title: isEditing ? "Edit Article" : "New Article", noIndex: true });

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    categoryId: "",
    tags: "",
    scheduledFor: "",
    metaTitle: "",
    metaDescription: "",
  });
  const [featuredImageFile, setFeaturedImageFile] = useState(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (!isEditing) return;
    api.get(`/articles/me/mine`, { params: { limit: 100 } }).then(({ data }) => {
      const article = data.data.results.find((a) => a._id === id);
      if (article) {
        setForm({
          title: article.title,
          excerpt: article.excerpt || "",
          content: article.content || "",
          categoryId: article.category?._id || article.category || "",
          tags: (article.tags || []).map((t) => t.name || t).join(", "),
          scheduledFor: article.scheduledFor ? article.scheduledFor.slice(0, 16) : "",
          metaTitle: article.seo?.metaTitle || "",
          metaDescription: article.seo?.metaDescription || "",
        });
        setFeaturedImagePreview(article.featuredImage?.url || "");
      }
    });
  }, [id, isEditing]);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFeaturedImageFile(file);
    setFeaturedImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.title || !form.content || !form.categoryId) {
      toast.error("Title, content, and category are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        categoryId: form.categoryId,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        scheduledFor: form.scheduledFor || undefined,
        seo: { metaTitle: form.metaTitle, metaDescription: form.metaDescription },
      };

      let article;
      if (isEditing) {
        article = await dispatch(updateArticle({ id, payload })).unwrap();
      } else {
        article = await dispatch(createArticle(payload)).unwrap();
      }

      if (featuredImageFile) {
        await dispatch(uploadFeaturedImage({ id: article._id, file: featuredImageFile })).unwrap();
      }

      toast.success(isEditing ? "Article updated" : "Draft created");
      navigate("/dashboard/articles");
    } catch (err) {
      toast.error(err || "Could not save article");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-2xl font-bold text-ink">{isEditing ? "Edit Article" : "New Article"}</h1>

      <div className="mt-6 space-y-5">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={form.title} onChange={handleChange("title")} placeholder="Your headline" className="text-lg" />
        </div>

        <div>
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={form.excerpt}
            onChange={handleChange("excerpt")}
            placeholder="A short summary shown on article cards (auto-generated if left blank)"
            className="min-h-[70px]"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select id="category" value={form.categoryId} onChange={handleChange("categoryId")}>
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" value={form.tags} onChange={handleChange("tags")} placeholder="elections, accra, economy" />
          </div>
        </div>

        <div>
          <Label>Featured image</Label>
          <label className="flex aspect-[21/9] cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-line-strong bg-slate-50 hover:border-accent">
            {featuredImagePreview ? (
              <img src={featuredImagePreview} alt="Featured preview" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted">
                <ImagePlus size={28} />
                <span className="text-sm">Click to upload a featured image</span>
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
          </label>
        </div>

        <div>
          <Label>Content</Label>
          <RichTextEditor content={form.content} onChange={(html) => setForm((f) => ({ ...f, content: html }))} />
        </div>

        <div className="rounded-lg border border-line p-4">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">SEO metadata</p>
          <div className="mt-3 space-y-3">
            <div>
              <Label htmlFor="metaTitle">Meta title</Label>
              <Input id="metaTitle" value={form.metaTitle} onChange={handleChange("metaTitle")} maxLength={70} />
            </div>
            <div>
              <Label htmlFor="metaDescription">Meta description</Label>
              <Textarea
                id="metaDescription"
                value={form.metaDescription}
                onChange={handleChange("metaDescription")}
                maxLength={160}
                className="min-h-[60px]"
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="scheduledFor">Schedule publication (optional)</Label>
          <Input id="scheduledFor" type="datetime-local" value={form.scheduledFor} onChange={handleChange("scheduledFor")} />
        </div>

        <div className="flex justify-end gap-3 border-t border-line pt-5">
          <Button variant="outline" onClick={() => navigate("/dashboard/articles")}>
            Cancel
          </Button>
          <Button variant="accent" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : isEditing ? "Save changes" : "Save draft"}
          </Button>
        </div>
      </div>
    </div>
  );
}
