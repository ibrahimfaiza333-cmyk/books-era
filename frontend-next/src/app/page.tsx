export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { MainLayoutClient, HomeClient } from "@/app/PageLoaders";

export const metadata: Metadata = {
  title: "Suleman Books | Home",
  description: "Your trusted book store.",
};

export default function Page() {
  return (
    <MainLayoutClient>
      <HomeClient />
    </MainLayoutClient>
  );
}
