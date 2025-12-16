import React, { useEffect, useRef, useState } from "react";
import {
  Home,
  TrendingUp,
  Globe,
  Users,
  DollarSign,
  Film,
  Newspaper,
  Menu,
  X,
  Search,
  Clock,
  Eye,
  MessageCircle,
  ArrowLeft,
  Share2,
  Bookmark,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addPost,
  fetchPosts,
  removePost,
  updatePostInState,
} from "../store/slices/post";
import { client } from "@/lib/appwrite";
// Dummy Data

const categories = [
  {
    id: 1,
    name: "Politics",
    slug: "politics",
    description: "Latest political news and updates",
    icon: "Users",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-12-13T00:00:00Z",
  },
  {
    id: 2,
    name: "Business",
    slug: "business",
    description: "Business news, economy and finance",
    icon: "DollarSign",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-12-13T00:00:00Z",
  },
  {
    id: 3,
    name: "Sports",
    slug: "sports",
    description: "Latest sports news and updates",
    icon: "TrendingUp",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-12-13T00:00:00Z",
  },
  {
    id: 4,
    name: "Entertainment",
    slug: "entertainment",
    description: "Entertainment news, music and lifestyle",
    icon: "Film",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-12-13T00:00:00Z",
  },
  {
    id: 5,
    name: "International",
    slug: "international",
    description: "World news and international affairs",
    icon: "Globe",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-12-13T00:00:00Z",
  },
  {
    id: 6,
    name: "Health",
    description: "Health news",
    icon: "Heart",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-12-13T00:00:00Z",
  },
  {
    id: 7,
    name: "Education",
    description: "Latest news on Education",
    icon: "Book",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-12-13T00:00:00Z",
  },
];

const HomeScreen = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  useEffect(() => {
    let unsubscribe = null;

    const setupRealtime = () => {
      const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
      const collectionId = import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID;

      console.log("🔌 Setting up realtime subscription");

      unsubscribe = client.subscribe(
        `databases.${databaseId}.collections.${collectionId}.documents`,
        (response) => {
          console.log("🔔 Realtime event:", response.events);
          const post = response.payload;

          // Handle create event
          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.create"
            )
          ) {
            console.log("➕ Adding new post to state");
            dispatch(addPost(post));
          }
          // Handle update event
          else if (
            response.events.includes(
              "databases.*.collections.*.documents.*.update"
            )
          ) {
            console.log("✏️ Updating post in state");
            dispatch(updatePostInState(post));
          }
          // Handle delete event
          else if (
            response.events.includes(
              "databases.*.collections.*.documents.*.delete"
            )
          ) {
            console.log("🗑️ Removing post from state");
            dispatch(removePost(post.$id));
          }
        }
      );

      unsubscribeRef.current = unsubscribe;
    };

    setupRealtime();

    // Cleanup on unmount
    return () => {
      if (unsubscribeRef.current) {
        console.log("🔌 Unsubscribing from realtime");
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [dispatch]);

  const getIconComponent = (iconName) => {
    const icons = {
      Users,
      DollarSign,
      TrendingUp,
      Film,
      Globe,
      Newspaper,
      Heart,
    };
    const Icon = icons[iconName] || Newspaper;
    return <Icon className="w-5 h-5" />;
  };

  const formatDate = (createdAt) => {
    return new Date(createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  const formatViews = (views = (Math.random() * 1000).toFixed(0)) => {
    if (views >= 1000) {
      return (views / 1000).toFixed(1) + "K";
    }
    return views;
  };

  const filteredPosts = selectedCategory
    ? posts?.filter((post) => post.category === selectedCategory)
    : posts;

  const searchedPosts = searchQuery
    ? filteredPosts?.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredPosts;

  const handlePostClick = (post) => {
    setSelectedPost(post);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToHome = () => {
    setSelectedPost(null);
  };

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackToHome}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition"
              >
                <ArrowLeft className="w-5 h-5" />
                {/* <span className="font-medium">Back to Home</span> */}
              </button>
              <h1 className="text-2xl font-bold text-indigo-600">
                SirPeace<span className="text-gray-800">Blog</span>
              </h1>
              {/*  <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-full transition">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition">
                  <Bookmark className="w-5 h-5 text-gray-600" />
                </button>
              </div> */}
            </div>
          </div>
        </header>

        {/* Article Content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          <article className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img
              src={selectedPost.coverImage}
              alt={selectedPost.title}
              className="w-full h-96 object-cover"
            />
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <span className="inline-block bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  {selectedPost.category}
                </span>
                <span className="text-gray-500 text-sm flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedPost?.$createdAt &&
                    formatDate(selectedPost.$createdAt)}
                </span>
                <span className="text-gray-500 text-sm flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {formatViews(selectedPost.views)} views
                </span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {selectedPost.title}
              </h1>

              <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-200">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {selectedPost.author}
                  </p>
                  <p className="text-sm text-gray-500">Staff Writer</p>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                {selectedPost.content.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="mb-6 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-gray-200">
                {/* <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition">
                      <MessageCircle className="w-5 h-5" />
                      <span>Comment</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition">
                      <Share2 className="w-5 h-5" />
                      <span>Share</span>
                    </button>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition">
                    <Bookmark className="w-5 h-5" />
                    <span>Save</span>
                  </button>
                </div> */}
              </div>
            </div>
          </article>

          {/* Related Posts */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts
                .filter(
                  (post) =>
                    post.category === selectedPost.category &&
                    post.$id !== selectedPost.$id
                )
                .slice(0, 2)
                .map((post) => (
                  <div
                    key={post.id}
                    onClick={() => handlePostClick(post)}
                    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-indigo-600 transition line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  const featuredPost = searchedPosts[0];
  const trendingPosts = posts.length > 0 && searchedPosts?.slice(0, 1);
  const recentPosts = searchedPosts?.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-indigo-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span className="font-semibold">Breaking News:</span>
            <span className="hidden sm:inline">
              Latest updates from across Ghana
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4" />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 hover:bg-gray-100 rounded"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-indigo-600">
                SirPeace<span className="text-gray-800">Blog</span>
              </h1>
            </div>

            {/* <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-4 py-2 w-96">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search news..."
                className="bg-transparent border-none outline-none ml-2 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div> */}
            <Link to="/admin/login">
              <button className="hidden sm:block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                Login
              </button>
            </Link>
          </div>

          <nav
            className={`${
              isMobileMenuOpen ? "block" : "hidden"
            } lg:block border-t border-gray-200 py-3`}
          >
            <div className="flex flex-col lg:flex-row gap-2 lg:gap-4">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`flex items-center gap-2 px-4 py-2 rounded transition ${
                  !selectedCategory
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="font-medium">All</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded transition ${
                    selectedCategory === cat.name
                      ? "bg-indigo-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {getIconComponent(cat.icon)}
                  <span className="font-medium">{cat.name}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {searchedPosts.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No articles found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or category filter
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {featuredPost && (
                <div
                  onClick={() => handlePostClick(featuredPost)}
                  className="bg-white rounded-xl shadow-lg overflow-hidden group cursor-pointer"
                >
                  <div className="relative h-96 overflow-hidden">
                    <img
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <span className="inline-block bg-indigo-600 px-3 py-1 rounded text-sm font-semibold mb-3">
                        {featuredPost.category}
                      </span>
                      <h2 className="text-3xl font-bold mb-3 group-hover:text-indigo-300 transition">
                        {featuredPost.title}
                      </h2>
                      {/* <p className="text-gray-200 mb-4">
                        {featuredPost.excerpt}
                      </p> */}
                      <div className="flex items-center gap-4 text-sm text-gray-300">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {featuredPost.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {featuredPost?.$createdAt &&
                            formatDate(featuredPost.$createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {formatViews(featuredPost.views)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-800">
                  {selectedCategory
                    ? `${
                        categories.find((c) => c.name === selectedCategory).name
                      } Stories`
                    : "Latest Stories"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recentPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => handlePostClick(post)}
                      className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer hover:shadow-xl transition"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <span className="absolute top-3 left-3 bg-indigo-600 text-white px-3 py-1 rounded text-xs font-semibold">
                          {post.category}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-indigo-600 transition line-clamp-2">
                          {post.title}
                        </h3>
                        {/*  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p> */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post?.$createdAt && formatDate(post.$createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {formatViews(post.views)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-xl font-bold text-gray-800">
                    Trending Now
                  </h3>
                </div>
                <div className="space-y-4">
                  {trendingPosts.map((post, index) => (
                    <div
                      key={post.id}
                      onClick={() => handlePostClick(post)}
                      className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 cursor-pointer group"
                    >
                      <span className="text-3xl font-bold text-indigo-600 opacity-30">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-2 group-hover:text-indigo-600 transition line-clamp-2">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post?.$createdAt && formatDate(post.$createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {formatViews(post.views)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  Categories
                </h3>
                <div className="space-y-3">
                  {categories.map((cat) => {
                    const categoryPosts = posts.filter(
                      (p) => p.category === cat.name
                    );
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition group ${
                          selectedCategory === cat.name
                            ? "bg-indigo-50 border-2 border-indigo-600"
                            : "hover:bg-gray-50 border-2 border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg transition ${
                              selectedCategory === cat.id
                                ? "bg-indigo-600 text-white"
                                : "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100"
                            }`}
                          >
                            {getIconComponent(cat.icon)}
                          </div>
                          <span
                            className={`font-medium ${
                              selectedCategory === cat.id
                                ? "text-indigo-600"
                                : "text-gray-700"
                            }`}
                          >
                            {cat.name}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {categoryPosts.length}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg shadow-md p-6 text-white">
                <h3 className="text-xl font-bold mb-3">Stay Updated</h3>
                <p className="text-indigo-100 text-sm mb-4">
                  Get the latest news delivered to your inbox
                </p>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-2 rounded-lg text-gray-800 mb-3 outline-none"
                />
                <button className="w-full bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-xl font-bold mb-4">
                SirPeaceBlog
              </h3>
              <p className="text-sm text-gray-400">
                Your trusted source for news, sports, business, and
                entertainment from Ghana and beyond.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="#" className="hover:text-indigo-400 transition">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-indigo-400 transition">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-indigo-400 transition">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-indigo-400 transition">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm">
                {categories.slice(0, 4).map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setSelectedCategory(cat.id)}
                      className="hover:text-indigo-400 transition"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-3">
                {["F", "T", "I", "Y"].map((social, index) => (
                  <button
                    key={index}
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition"
                  >
                    <span className="text-sm font-bold">{social}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 SirPeaceBlog. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeScreen;
