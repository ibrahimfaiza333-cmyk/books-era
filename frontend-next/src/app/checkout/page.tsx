export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { MainLayoutClient, CheckoutClient } from "@/app/PageLoaders";

export const metadata: Metadata = {
  title: "Checkout | Suleman Books",
  description: "Complete your purchase.",
};

export default function Page() {
  return (
    <MainLayoutClient>
      <CheckoutClient />
    </MainLayoutClient>
  );
}
