import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RoleRoute } from "@/routes/RoleRoute";
import { PageSpinner } from "@/components/common/Loaders";
import { USER_ROLES } from "@/constants/roles";

const HomePage = lazy(() => import("@/pages/HomePage"));
const ArticlePage = lazy(() => import("@/pages/ArticlePage"));
const CategoryPage = lazy(() => import("@/pages/CategoryPage"));
const TagPage = lazy(() => import("@/pages/TagPage"));
const AuthorPage = lazy(() => import("@/pages/AuthorPage"));
const SearchPage = lazy(() => import("@/pages/SearchPage"));
const BookmarksPage = lazy(() => import("@/pages/BookmarksPage"));
const NotificationsPage = lazy(() => import("@/pages/NotificationsPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("@/pages/ResetPasswordPage"));
const VerifyEmailPage = lazy(() => import("@/pages/VerifyEmailPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage"));
const TermsPage = lazy(() => import("@/pages/TermsPage"));
const NewsletterPage = lazy(() => import("@/pages/NewsletterPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

const DashboardOverviewPage = lazy(() => import("@/pages/dashboard/DashboardOverviewPage"));
const MyArticlesPage = lazy(() => import("@/pages/dashboard/MyArticlesPage"));
const ArticleEditorPage = lazy(() => import("@/pages/dashboard/ArticleEditorPage"));
const DashboardAnalyticsPage = lazy(() => import("@/pages/dashboard/DashboardAnalyticsPage"));
const ReviewQueuePage = lazy(() => import("@/pages/dashboard/ReviewQueuePage"));

const AdminOverviewPage = lazy(() => import("@/pages/admin/AdminOverviewPage"));
const AdminUsersPage = lazy(() => import("@/pages/admin/AdminUsersPage"));
const AdminArticlesPage = lazy(() => import("@/pages/admin/AdminArticlesPage"));
const AdminCommentsPage = lazy(() => import("@/pages/admin/AdminCommentsPage"));
const AdminAdvertisementsPage = lazy(() => import("@/pages/admin/AdminAdvertisementsPage"));
const AdminAnalyticsPage = lazy(() => import("@/pages/admin/AdminAnalyticsPage"));
const AdminSettingsPage = lazy(() => import("@/pages/admin/AdminSettingsPage"));
const AdminLogsPage = lazy(() => import("@/pages/admin/AdminLogsPage"));

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageSpinner />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/article/:slug" element={<ArticlePage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/tag/:slug" element={<TagPage />} />
            <Route path="/author/:username" element={<AuthorPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/newsletter" element={<NewsletterPage />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Route>

            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route element={<RoleRoute minRole={USER_ROLES.AUTHOR} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardOverviewPage />} />
              <Route path="/dashboard/articles" element={<MyArticlesPage />} />
              <Route path="/dashboard/articles/new" element={<ArticleEditorPage />} />
              <Route path="/dashboard/articles/:id/edit" element={<ArticleEditorPage />} />
              <Route path="/dashboard/analytics" element={<DashboardAnalyticsPage />} />
            </Route>
          </Route>

          <Route element={<RoleRoute minRole={USER_ROLES.EDITOR} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard/review-queue" element={<ReviewQueuePage />} />
            </Route>
          </Route>

          <Route element={<RoleRoute minRole={USER_ROLES.ADMIN} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminOverviewPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/articles" element={<AdminArticlesPage />} />
              <Route path="/admin/comments" element={<AdminCommentsPage />} />
              <Route path="/admin/advertisements" element={<AdminAdvertisementsPage />} />
              <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
            </Route>
          </Route>

          <Route element={<RoleRoute minRole={USER_ROLES.SUPER_ADMIN} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/settings" element={<AdminSettingsPage />} />
              <Route path="/admin/logs" element={<AdminLogsPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
