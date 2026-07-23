import { Link2, MessageCircle } from "lucide-react";
import { TwitterIcon, FacebookIcon, LinkedinIcon } from "@/components/ui/social-icons";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import api from "@/api/axiosInstance";

export function ShareButtons({ articleId, title, url }) {
  const dispatch = useDispatch();

  const record = () => {
    api.post(`/articles/${articleId}/share`).catch(() => {});
  };

  const shareLinks = [
    {
      label: "Share on Facebook",
      icon: FacebookIcon,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      label: "Share on X",
      icon: TwitterIcon,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      label: "Share on LinkedIn",
      icon: LinkedinIcon,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      label: "Share on WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    },
  ];

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
    record();
  };

  return (
    <div className="flex items-center gap-2">
      {shareLinks.map(({ label, icon: Icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          onClick={record}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft hover:border-accent hover:text-accent transition-colors"
        >
          <Icon size={16} />
        </a>
      ))}
      <button
        aria-label="Copy link"
        onClick={copyLink}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft hover:border-accent hover:text-accent transition-colors"
      >
        <Link2 size={16} />
      </button>
    </div>
  );
}
