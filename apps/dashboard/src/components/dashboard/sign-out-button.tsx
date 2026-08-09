"use client";

import { signOutAction } from "@/actions/auth/sign-out";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <Button type="submit" variant="outline" size="sm">
        Se déconnecter
      </Button>
    </form>
  );
}
