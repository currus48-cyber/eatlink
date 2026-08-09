import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="text-lg font-semibold tracking-tight">
            EatLink
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
