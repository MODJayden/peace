import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Globe, UserPlus, UserCheck } from "lucide-react";
import { TwitterIcon, FacebookIcon, LinkedinIcon } from "@/components/ui/social-icons";
import { toast } from "sonner";
import api from "@/api/axiosInstance";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArticleGrid } from "@/components/article/ArticleGrid";
import { PageSpinner } from "@/components/common/Loaders";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentHead } from "@/hooks/useDocumentHead";

export default function AuthorPage() {
  const { username } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [articles, setArticles] = useState([]);
  const [status, setStatus] = useState("loading");
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    setStatus("loading");
    api
      .get(`/users/${username}`)
      .then(({ data }) => {
        setProfile(data.data);
        setIsFollowing(
          data.data.authorProfile?.followers?.some((id) => id === currentUser?._id) || false
        );
        return api.get("/articles", { params: { author: data.data.user._id, sort: "latest" } });
      })
      .then(({ data }) => setArticles(data.data.results))
      .catch(() => {})
      .finally(() => setStatus("succeeded"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  useDocumentHead({ title: profile?.user?.name, description: profile?.user?.bio });

  const handleFollow = async () => {
    if (!isAuthenticated) return toast.error("Please log in to follow authors");
    try {
      const { data } = await api.post(`/users/${profile.user._id}/follow`);
      setIsFollowing(data.data.following);
    } catch {
      toast.error("Could not update follow status");
    }
  };

  if (status === "loading") return <PageSpinner />;
  if (!profile) return null;

  const { user, authorProfile } = profile;
  const social = user.socialLinks || {};

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-col items-center gap-5 border-b border-line pb-8 text-center sm:flex-row sm:text-left">
        <Avatar src={user.avatar?.url} name={user.name} size={96} />
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold text-ink">{user.name}</h1>
          {authorProfile?.title && <p className="text-sm text-accent font-medium">{authorProfile.title}</p>}
          <p className="mt-2 max-w-xl text-body">{user.bio}</p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm text-muted sm:justify-start">
            <span>
              <strong className="text-ink">{authorProfile?.stats?.totalArticles || 0}</strong> articles
            </span>
            <span>
              <strong className="text-ink">{authorProfile?.stats?.followerCount || 0}</strong> followers
            </span>
            <span>
              <strong className="text-ink">{authorProfile?.stats?.totalViews || 0}</strong> views
            </span>
          </div>

          <div className="mt-4 flex items-center justify-center gap-3 sm:justify-start">
            {currentUser?._id !== user._id && (
              <Button onClick={handleFollow} variant={isFollowing ? "outline" : "accent"} size="sm">
                {isFollowing ? <UserCheck size={15} className="mr-1.5" /> : <UserPlus size={15} className="mr-1.5" />}
                {isFollowing ? "Following" : "Follow"}
              </Button>
            )}
            {social.twitter && (
              <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-ink">
                <TwitterIcon size={18} />
              </a>
            )}
            {social.facebook && (
              <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-ink">
                <FacebookIcon size={18} />
              </a>
            )}
            {social.linkedin && (
              <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-ink">
                <LinkedinIcon size={18} />
              </a>
            )}
            {social.website && (
              <a href={social.website} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-ink">
                <Globe size={18} />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-xl font-semibold text-ink">Articles by {user.name}</h2>
        <div className="mt-5">
          <ArticleGrid articles={articles} isLoading={false} columns={3} />
        </div>
      </div>
    </div>
  );
}
