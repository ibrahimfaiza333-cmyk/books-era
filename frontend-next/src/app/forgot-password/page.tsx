export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { ForgotPasswordClient } from "@/app/PageLoaders";

export const metadata: Metadata = {
  title: "Forgot Password | Suleman Books",
  description: "Reset your password.",
};

export default function Page() {
  return <ForgotPasswordClient />;
}
