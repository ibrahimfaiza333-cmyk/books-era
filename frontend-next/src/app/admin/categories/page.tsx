export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { AdminLayoutClient, AdminCategoriesClient } from "@/app/PageLoaders";

export const metadata: Metadata = {
  title: "Manage Categories | Admin",
  description: "Suleman Books admin - manage categories.",
};

export default function Page() {
  return (
    <AdminLayoutClient>
      <AdminCategoriesClient />
    </AdminLayoutClient>
  );
}
