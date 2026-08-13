"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated) {
      router.replace("/login");
    } else {
      setChecked(true);
    }
  }, [hasHydrated, isAuthenticated, router]);

  // Wait for localStorage rehydration before deciding anything,
  // otherwise a logged-in user gets briefly bounced to /login on refresh.
  if (!hasHydrated || !checked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <span className="font-heading text-lg font-semibold">
          Pet Care Dashboard
        </span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {currentUser?.name}
          </span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}