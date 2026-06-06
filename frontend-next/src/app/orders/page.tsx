export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { MainLayoutClient, OrdersClient } from "@/app/PageLoaders";

export const metadata: Metadata = {
  title: "My Orders | Suleman Books",
  description: "View your orders.",
};

export default function Page() {
  return (
    <MainLayoutClient>
      <OrdersClient />
    </MainLayoutClient>
  );
}
