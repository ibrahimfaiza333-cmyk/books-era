export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { MainLayoutClient, WishlistClient } from "@/app/PageLoaders";

export const metadata: Metadata = {
  title: "Wishlist | Suleman Books",
  description: "Your saved books.",
};

export default function Page() {
  return (
    <MainLayoutClient>
      <WishlistClient />
    </MainLayoutClient>
  );
}
