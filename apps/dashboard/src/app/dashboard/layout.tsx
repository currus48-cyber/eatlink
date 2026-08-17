import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { auth } from "@/auth";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { prisma } from "@/lib/prisma";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Tableau de bord" },
  { href: "/dashboard/reservations", label: "Réservations" },
  { href: "/dashboard/restaurant", label: "Horaires" },
];

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  // V1 assumes one restaurant per owner — same lookup as
  // dashboard/reservations/page.tsx. Purely for display (name/logo in the
  // nav) — no new read path is introduced by any other page.
  const restaurant = await prisma.restaurant.findFirst({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: "asc" },
    select: { name: true, logoUrl: true },
  });

  return (
    <div className="flex min-h-svh flex-col lg:flex-row">
      <aside className="hidden w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-2.5 border-b border-sidebar-border px-5 py-5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
            E
          </span>
          <span className="font-heading text-[15px] font-semibold tracking-tight text-sidebar-foreground">
            EatLink
          </span>
        </div>

        {restaurant && (
          <div className="flex items-center gap-2.5 border-b border-sidebar-border px-5 py-4">
            {restaurant.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element -- arbitrary owner-provided domain, can't be pre-declared in next.config remotePatterns
              <img
                src={restaurant.logoUrl}
                alt=""
                className="size-8 shrink-0 rounded-full border border-sidebar-border object-cover"
              />
            )}
            <span className="truncate font-heading text-sm font-semibold text-sidebar-foreground">
              {restaurant.name}
            </span>
          </div>
        )}

        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3 border-t border-sidebar-border p-4">
          <span className="truncate px-1 text-xs text-sidebar-foreground/60">
            {session.user.email}
          </span>
          <SignOutButton className="border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-col bg-sidebar text-sidebar-foreground lg:hidden">
          <div className="flex items-center justify-between px-4 py-3.5">
            <div className="flex min-w-0 items-center gap-2">
              {restaurant?.logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element -- arbitrary owner-provided domain, can't be pre-declared in next.config remotePatterns
                <img
                  src={restaurant.logoUrl}
                  alt=""
                  className="size-7 shrink-0 rounded-full border border-sidebar-border object-cover"
                />
              )}
              <span className="truncate font-heading text-sm font-semibold tracking-tight">
                {restaurant?.name ?? "EatLink"}
              </span>
            </div>
            <SignOutButton className="border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
          </div>
          <nav className="flex gap-1.5 overflow-x-auto px-3 pb-3.5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-full bg-sidebar-accent px-3.5 py-1.5 text-xs font-medium text-sidebar-accent-foreground transition-colors hover:bg-sidebar-accent/70"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
