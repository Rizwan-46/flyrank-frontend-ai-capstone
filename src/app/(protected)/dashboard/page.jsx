"use client";

import { useAuthStore } from "@/store/authStore";

export default function DashboardPage() {
  const currentUser = useAuthStore((state) => state.currentUser);

  return (
    <div>
      <h1 className="text-2xl font-semibold">
        Welcome back, {currentUser?.name?.split(" ")[0]} 👋
      </h1>
      <p className="mt-2 text-muted-foreground">
        You are logged in. Dashboard features will be implemented in the next phase.
      </p>
    </div>
  );
}