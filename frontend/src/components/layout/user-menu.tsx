"use client";

import Link from "next/link";
import { Heart, LayoutDashboard, LogOut, Package, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMe } from "@/lib/hooks/use-me";
import { useSession } from "@/lib/hooks/use-session";
import { useSignOut } from "@/lib/hooks/use-sign-out";
import { initials } from "@/lib/format";

export function UserMenu() {
  const { data: me } = useMe();
  const { isAdmin } = useSession();
  const signOut = useSignOut();
  const name = me?.username ?? "Account";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="grid size-10 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background pointer-coarse:size-11"
        aria-label="Account menu"
      >
        <Avatar className="size-8">
          {me?.avatar ? <AvatarImage src={me.avatar} alt="" /> : null}
          <AvatarFallback className="text-xs font-medium">{initials(name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52">
        <DropdownMenuLabel className="font-normal">
          <span className="block truncate text-sm font-medium">{name}</span>
          {me?.email ? <span className="block truncate text-xs text-muted-foreground">{me.email}</span> : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="pointer-coarse:min-h-11">
          <Link href="/profile">
            <UserIcon aria-hidden /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="pointer-coarse:min-h-11">
          <Link href="/favourites">
            <Heart aria-hidden /> Favourites
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="pointer-coarse:min-h-11">
          <Link href="/orders">
            <Package aria-hidden /> Orders
          </Link>
        </DropdownMenuItem>
        {isAdmin ? (
          <DropdownMenuItem asChild className="pointer-coarse:min-h-11">
            <Link href="/admin">
              <LayoutDashboard aria-hidden /> Admin
            </Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={signOut} className="pointer-coarse:min-h-11">
          <LogOut aria-hidden /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
