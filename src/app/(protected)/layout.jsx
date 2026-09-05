"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { Spinner } from "@/components/ui/Spinner";

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated) {
      router.replace("/login");
    } else {
      setChecked(true);
    }
  }, [hasHydrated, isAuthenticated, router]);

  if (!hasHydrated || !checked) {
    return (
      <div className="flex h-dvh items-center justify-center bg-background">
        {/* <p className="text-sm text-muted-foreground">Loading dashboard...</p> */}
        <Spinner/>
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <div className="shrink-0">
        <DashboardNav />
      </div>
      <main className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col overflow-y-auto px-4 pb-0 pt-4 sm:p-6 lg:p-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </main>
    </div>
  );
}