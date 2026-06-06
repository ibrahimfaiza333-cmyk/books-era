export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { AdminLayoutClient, AdminUsersClient } from "@/app/PageLoaders";

export const metadata: Metadata = {
  title: "Manage Users | Admin",
  description: "Suleman Books admin - manage users.",
};

export default function Page() {
  return (
    <AdminLayoutClient>
      <AdminUsersClient />
    </AdminLayoutClient>
  );
}
