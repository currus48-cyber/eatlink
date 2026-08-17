"use client";

import { signOutAction } from "@/actions/auth/sign-out";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SignOutButton({ className }: { className?: string }) {
  return (
    <form action={signOutAction}>
      <Button type="submit" variant="outline" size="sm" className={cn(className)}>
        Se déconnecter
      </Button>
    </form>
  );
}
