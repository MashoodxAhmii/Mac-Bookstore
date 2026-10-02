import type { Metadata } from "next";
import { AuthGuard } from "@/components/layout/guards";
import { FavouritesPageClient } from "./favourites-page-client";

export const metadata: Metadata = { title: "Favourites" };

export default function FavouritesPage() {
  return (
    <AuthGuard>
      <FavouritesPageClient />
    </AuthGuard>
  );
}
