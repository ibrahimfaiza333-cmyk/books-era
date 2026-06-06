export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { LoginClient } from "@/app/PageLoaders";

export const metadata: Metadata = {
  title: "Login | Suleman Books",
  description: "Sign in to your account.",
};

export default function Page() {
  return <LoginClient />;
}
