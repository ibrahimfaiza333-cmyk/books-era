export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { MainLayoutClient, CartClient } from "@/app/PageLoaders";

export const metadata: Metadata = {
  title: "Your Cart | Suleman Books",
  description: "Your shopping cart.",
};

export default function Page() {
  return (
    <MainLayoutClient>
      <CartClient />
    </MainLayoutClient>
  );
}
