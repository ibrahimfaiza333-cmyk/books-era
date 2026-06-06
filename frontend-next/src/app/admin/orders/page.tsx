export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { AdminLayoutClient, AdminOrdersClient } from "@/app/PageLoaders";

export const metadata: Metadata = {
  title: "Manage Orders | Admin",
  description: "Suleman Books admin - manage orders.",
};

export default function Page() {
  return (
    <AdminLayoutClient>
      <AdminOrdersClient />
    </AdminLayoutClient>
  );
}
