"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AddressPanel } from "@/components/cart/address-panel";
import { Badge } from "@/components/vengeance/badge";
import { Button } from "@/components/vengeance/button";
import { PageSkeleton } from "@/components/states/skeletons";
import { ErrorState } from "@/components/states/error-state";
import { useFavourites } from "@/lib/hooks/use-favourites";
import { useMe } from "@/lib/hooks/use-me";
import { useOrders } from "@/lib/hooks/use-orders";
import { useSignOut } from "@/lib/hooks/use-sign-out";
import { formatNumber, initials } from "@/lib/format";

export function ProfilePageClient() {
  const { data: me, isPending, isError, error, refetch } = useMe();
  const { data: favourites } = useFavourites();
  const { data: orders } = useOrders();
  const signOut = useSignOut();

  if (isPending) return <PageSkeleton />;
  if (isError || !me) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <ErrorState error={error} onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 px-4 py-10 sm:px-6">
      <div className="flex items-center gap-4">
        <Avatar className="size-16">
          {me.avatar ? <AvatarImage src={me.avatar} alt="" /> : null}
          <AvatarFallback className="text-lg font-medium">{initials(me.username)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-xl font-medium">{me.username}</h1>
            <Badge variant={me.role === "admin" ? "highlight" : "secondary"} className="capitalize">
              {me.role}
            </Badge>
          </div>
          <p className="text-muted-foreground">{me.email}</p>
        </div>
      </div>

      <section className="rounded-card border border-border bg-card p-5 shadow-card">
        <AddressPanel address={me.address} />
      </section>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-card border border-border bg-card p-5 text-center shadow-card">
          <p className="text-2xl font-medium">{formatNumber(favourites?.length ?? me.favourite.length)}</p>
          <p className="text-sm text-muted-foreground">Favourites</p>
        </div>
        <div className="rounded-card border border-border bg-card p-5 text-center shadow-card">
          <p className="text-2xl font-medium">{formatNumber(orders?.length ?? me.orders.length)}</p>
          <p className="text-sm text-muted-foreground">Orders</p>
        </div>
      </div>

      <Button variant="outline" onClick={signOut}>
        Sign out
      </Button>
    </div>
  );
}
