export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { AdminCouponsClient } from "@/app/PageLoaders";

export const metadata: Metadata = {
  title: "Manage Coupons | Admin",
  description: "Create and manage discount coupons.",
};

export default function Page() {
  return <AdminCouponsClient />;
}
