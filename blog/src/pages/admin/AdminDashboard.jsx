import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Image,
  Calendar,
  Tag,
  Search,
  X,
  Loader2,
  Upload,
  AlertCircle,
} from "lucide-react";
import {
  createPost,
  uploadImage,
  deletePost,
  updatePost,
  deleteImage,
  fetchPostsByAuthor,
  addPost,
  updatePostInState,
  removePost,
} from "@/store/slices/post";
import { useDispatch, useSelector } from "react-redux";
import { getUser, logout } from "@/store/slices/authSlice";
import { client } from "@/lib/appwrite";
import { useNavigate } from "react-router-dom";

const mockCategories = [
  "Business",
  "Sports",
  "Entertainment",
  "International",
  "Health",
  "Education",
  "Politics",
];

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const dispatch = useDispatch();
  const userId = useRef(null);
  const [uploadedImageId, setUploadedImageId] = useState(null);
  const { posts } = useSelector((store) => store.post);
  const unsubscribeRef = useRef(null);
  const hasFetchedRef = useRef(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    coverImage: "",
    coverImageId: "",
    category: "",
    isPublished: false,
  });

  // Fetch user and posts on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        const userResponse = await dispatch(getUser()).unwrap();
        const currentUserId = userResponse.$id;
        userId.current = currentUserId;
        if (!hasFetchedRef.current) {
          await dispatch(fetchPostsByAuthor(userId.current ));
          hasFetchedRef.current = true;
        }
      } catch (error) {
        console.error("Failed to initialize:", error);
        setError("Failed to load user data");
      }
    };

    initializeData();
  }, [dispatch]);

  // Set up realtime subscription
  useEffect(() => {
    let unsubscribe = null;
    const setupRealtime = () => {
      const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
      const collectionId = import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID;
      unsubscribe = client.subscribe(
        `databases.${databaseId}.collections.${collectionId}.documents`,
        (response) => {
          const post = response.payload;
          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.create"
            )
          ) {
            dispatch(addPost(post));
          } else if (
            response.events.includes(
              "databases.*.collections.*.documents.*.update"
            )
          ) {
            dispatch(updatePostInState(post));
          } else if (
            response.events.includes(
              "databases.*.collections.*.documents.*.delete"
            )
          ) {
            dispatch(removePost(post.$id));
          }
        }
      );
      unsubscribeRef.current = unsubscribe;
    };
    setupRealtime();
    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, [dispatch]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleDeleteImage = async () => {
    try {
      if (!uploadedImageId) {
        // Just clear preview if no uploaded image
        setImagePreview(null);
        setImageFile(null);
        setFormData((prev) => ({
          ...prev,
          coverImage: "",
          coverImageId: "",
        }));
        return;
      }

      console.log("Deleting image:", uploadedImageId);
      await dispatch(deleteImage({ fileId: uploadedImageId })).unwrap();

      console.log("✅ Image deleted successfully");
      setImagePreview(null);
      setImageFile(null);
      setUploadedImageId(null);
      setFormData((prev) => ({
        ...prev,
        coverImage: "",
        coverImageId: "",
      }));
    } catch (error) {
      console.error("❌ Delete image failed:", error);
      setError("Failed to delete image");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "title" && { slug: generateSlug(value) }),
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError("Image size should be less than 15MB");
      return;
    }

    setError(null);
    setIsUploading(true);

    // Create local preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to Appwrite
    dispatch(uploadImage(file))
      .unwrap()
      .then((res) => {
        setUploadedImageId(res.fileId);
        setImagePreview(res.fileUrl);
        setFormData((prev) => ({
          ...prev,
          coverImage: res.fileUrl,
          coverImageId: res.fileId,
        }));
        setIsUploading(false);
      })
      .catch((error) => {
        console.error("❌ Upload failed:", error);
        setError("Failed to upload image");
        setImagePreview(null);
        setIsUploading(false);
      });
  };

  const handleSubmit = async () => {
    setError(null);

    // Validation
    if (!formData.title || !formData.content || !formData.category) {
      setError("Please fill in all required fields");
      return;
    }

    setIsUploading(true);

    try {
      const postData = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        coverImage: formData.coverImage || "",
        coverImageId: formData.coverImageId || "",
        category: formData.category,
        authorId: userId.current,
        isPublic: formData.isPublished,
      };

      if (editingPost) {
        // Update existing post
        await dispatch(
          updatePost({
            postId: editingPost.$id,
            updates: postData,
          })
        ).unwrap();
        console.log("✅ Post updated");
      } else {
        // Create new post
        await dispatch(createPost(postData)).then((res) => {
          dispatch(fetchPostsByAuthor(userId.current));
        });
      }

      handleCloseModal();
    } catch (error) {
      console.error("❌ Failed to save post:", error);
      setError(editingPost ? "Failed to update post" : "Failed to create post");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      coverImage: post.coverImage,
      coverImageId: post.coverImageId || "",
      category: post.category,
      isPublished: post.isPublic || false,
    });
    setImagePreview(post.coverImage);
    setUploadedImageId(post.coverImageId);
    setIsModalOpen(true);
  };

  const handleDelete = async (post) => {
    console.log(post);
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    setIsLoading(true);
    try {
      // Delete image if exists
      /* if (post.coverImageId) {
        await dispatch(deleteImage(post.coverImageId)).unwrap();
      }
 */
      // Delete post
      await dispatch(deletePost(post.$id)).then((res) => console.log(res));
      console.log("✅ Post deleted");
    } catch (error) {
      console.error("❌ Failed to delete post:", error);
      setError("Failed to delete post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    setFormData({
      title: "",
      slug: "",
      content: "",
      coverImage: "",
      coverImageId: "",
      category: "",
      isPublished: false,
    });
    setImagePreview(null);
    setImageFile(null);
    setUploadedImageId(null);
    setError(null);
    setIsUploading(false);
  };
  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/");
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                My Posts
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and organize your blog content
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex text-center items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-lg hover:shadow-xl"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div className="sm:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition bg-white"
              >
                <option value="all">All Categories</option>
                {mockCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-end mb-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Create New Post
          </button>
        </div>
        {error && (
          <div className="mb-6 p-4 rounded-lg border bg-red-50 border-red-200 text-red-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        )}

        {!isLoading && filteredPosts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Image className="w-10 h-10 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No posts found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchQuery || selectedCategory !== "all"
                ? "Try adjusting your filters to see more results"
                : "Get started by creating your first blog post"}
            </p>
            {!searchQuery && selectedCategory === "all" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Create Your First Post
              </button>
            )}
          </div>
        )}

        {!isLoading && filteredPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.$id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="w-12 h-12 text-gray-300" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${
                        post.isPublic
                          ? "bg-green-500/90 text-white"
                          : "bg-gray-800/90 text-white"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {post.isPublic ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3" />
                        )}
                        {post.isPublic ? "Published" : "Draft"}
                      </span>
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 flex gap-2   ">
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-2.5 bg-white rounded-lg shadow-lg hover:bg-indigo-50 hover:scale-110 transition-all duration-200"
                    >
                      <Edit className="w-4 h-4 text-indigo-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(post)}
                      className="p-2.5 bg-white rounded-lg shadow-lg hover:bg-red-50 hover:scale-110 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {post.content}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(post.$createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{post.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseModal}
          />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingPost ? "Edit Post" : "Create New Post"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter post title"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="auto-generated-slug"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">
                    URL-friendly version (auto-generated)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition bg-white"
                  >
                    <option value="">Select a category</option>
                    {mockCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-500 transition">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          onClick={handleDeleteImage}
                          disabled={isUploading}
                          className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-lg disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 mb-1 font-medium">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 15MB
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="cover-image"
                          disabled={isUploading}
                        />
                        <label
                          htmlFor="cover-image"
                          className="inline-block mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition shadow-md hover:shadow-lg disabled:opacity-50"
                        >
                          {isUploading ? "Uploading..." : "Select Image"}
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Write your post content here..."
                    rows={8}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="isPublished"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="isPublished"
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    Publish immediately (visible to public)
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={handleCloseModal}
                    disabled={isUploading}
                    className="flex-1 px-4 py-2 rounded-lg font-medium transition bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isUploading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400 shadow-lg disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {editingPost ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>{editingPost ? "Update Post" : "Create Post"}</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
