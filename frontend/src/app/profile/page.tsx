import type { Metadata } from "next";
import { AuthGuard } from "@/components/layout/guards";
import { ProfilePageClient } from "./profile-page-client";

export const metadata: Metadata = { title: "Profile" };

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfilePageClient />
    </AuthGuard>
  );
}
