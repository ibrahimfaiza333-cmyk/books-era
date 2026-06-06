export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { MainLayoutClient, OrderDetailClient } from "@/app/PageLoaders";

export const metadata: Metadata = {
  title: "Order Details | Suleman Books",
  description: "View your order details.",
};

export default function Page() {
  return (
    <MainLayoutClient>
      <OrderDetailClient />
    </MainLayoutClient>
  );
}
