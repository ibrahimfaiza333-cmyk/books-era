export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { AdminLayoutClient, AdminReportsClient } from "@/app/PageLoaders";

export const metadata: Metadata = {
  title: "Reports | Admin",
  description: "Suleman Books admin - sales and performance reports.",
};

export default function Page() {
  return (
    <AdminLayoutClient>
      <AdminReportsClient />
    </AdminLayoutClient>
  );
}
