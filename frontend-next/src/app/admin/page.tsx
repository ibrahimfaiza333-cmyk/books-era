export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { AdminLayoutClient, AdminDashboardClient } from "@/app/PageLoaders";

export const metadata: Metadata = {
  title: "Admin Dashboard | Suleman Books",
  description: "Suleman Books admin panel.",
};

export default function Page() {
  return (
    <AdminLayoutClient>
      <AdminDashboardClient />
    </AdminLayoutClient>
  );
}
