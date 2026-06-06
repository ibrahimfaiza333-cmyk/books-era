export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { AdminLayoutClient, AdminBooksClient } from "@/app/PageLoaders";

export const metadata: Metadata = {
  title: "Manage Books | Admin",
  description: "Suleman Books admin - manage books.",
};

export default function Page() {
  return (
    <AdminLayoutClient>
      <AdminBooksClient />
    </AdminLayoutClient>
  );
}
