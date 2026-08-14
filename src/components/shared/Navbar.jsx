"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle"; // Adjust path if needed
import Logo from "@/components/shared/Logo";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Render Logo directly without wrapping in an outer <Link> */}
        <Logo href="/" />

        {/* Navigation & Auth */}
        <nav aria-label="Main Navigation" className="flex items-center gap-4 text-sm font-medium sm:gap-6">
          <Link 
            href="/about" 
            className="hidden text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className="hidden text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Contact
          </Link>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {/* Conditional Auth Button */}
            {!hasHydrated ? (
              <Button 
                variant="secondary" 
                size="sm" 
                aria-disabled="true" 
                className="w-[72px] pointer-events-none opacity-50"
              >
                <span className="opacity-0">Wait</span> 
              </Button>
            ) : isAuthenticated ? (
              <Button asChild variant="default" size="sm" data-testid="nav-dashboard-btn">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button asChild variant="secondary" size="sm" data-testid="nav-login-btn">
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}