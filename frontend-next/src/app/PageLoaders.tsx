"use client";
/**
 * All page components loaded with ssr:false so hooks (useQuery, useSelector, useParams)
 * never execute on the server during build-time prerendering.
 * Import from this file in your Server Component page.tsx files.
 */
import nextDynamic from "next/dynamic";

// ── Layouts ──────────────────────────────────────────────────────────────────
export const MainLayoutClient = nextDynamic(
  () => import("@/Layout/MainLayout"),
  { ssr: false }
);
export const AdminLayoutClient = nextDynamic(
  () => import("@/Layout/AdminRootLayout"),
  { ssr: false }
);

// ── Public pages ─────────────────────────────────────────────────────────────
export const HomeClient         = nextDynamic(() => import("@/views/Home"),           { ssr: false });
export const BooksClient        = nextDynamic(() => import("@/views/Books"),          { ssr: false });
export const BookDetailClient   = nextDynamic(() => import("@/views/BookDetail"),     { ssr: false });
export const LoginClient        = nextDynamic(() => import("@/views/Login"),          { ssr: false });
export const RegisterClient     = nextDynamic(() => import("@/views/Register"),       { ssr: false });
export const ForgotPasswordClient = nextDynamic(() => import("@/views/ForgotPassword"), { ssr: false });
export const ResetPasswordClient  = nextDynamic(() => import("@/views/ResetPassword"),  { ssr: false });

// ── User pages ────────────────────────────────────────────────────────────────
export const CartClient         = nextDynamic(() => import("@/views/Cart"),          { ssr: false });
export const CheckoutClient     = nextDynamic(() => import("@/views/Checkout"),      { ssr: false });
export const ProfileClient      = nextDynamic(() => import("@/views/Profile"),       { ssr: false });
export const OrdersClient       = nextDynamic(() => import("@/views/Orders"),        { ssr: false });
export const OrderDetailClient  = nextDynamic(() => import("@/views/OrderDetail"),   { ssr: false });
export const WishlistClient     = nextDynamic(() => import("@/views/Wishlist"),      { ssr: false });

// ── Admin pages ───────────────────────────────────────────────────────────────
export const AdminDashboardClient = nextDynamic(() => import("@/views/admin/Dashboard"),   { ssr: false });
export const AdminBooksClient     = nextDynamic(() => import("@/views/admin/ManageBooks"), { ssr: false });
export const AdminOrdersClient    = nextDynamic(() => import("@/views/admin/ManageOrders"),{ ssr: false });
export const AdminUsersClient     = nextDynamic(() => import("@/views/admin/ManageUsers"), { ssr: false });
export const AdminCategoriesClient = nextDynamic(() => import("@/views/admin/ManageCategories"), { ssr: false });
export const AdminReportsClient    = nextDynamic(() => import("@/views/admin/ManageReports"),    { ssr: false });
export const AdminCouponsClient    = nextDynamic(() => import("@/views/admin/ManageCoupons"),    { ssr: false });
