"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { ThemeToggle } from "../shared/ThemeToggle";
import Logo from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  PawPrint,
  Syringe,
  CalendarCheck,
  FileText,
  Menu,
  LogOut
} from "lucide-react";

 const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Pets", href: "/dashboard/pets", icon: PawPrint },
  { name: "Vaccinations", href: "/dashboard/vaccinations", icon: Syringe },
  { name: "Appointments", href: "/dashboard/appointments", icon: CalendarCheck },
  { name: "Records", href: "/dashboard/medical-records", icon: FileText },
];
export default function DashboardNav() {
  const pathname = usePathname();
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        <div className="flex min-w-0 items-center gap-8">
          <Logo href="/dashboard" />

          {/* Desktop Navigation — only from lg up, so tablets don't overflow */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Side Controls (Desktop & Mobile) */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <div className="hidden items-center gap-3 lg:flex">
            <span className="max-w-[10rem] truncate text-sm font-medium text-muted-foreground">
              {currentUser?.name}
            </span>
            <Button variant="outline" size="sm" onClick={logout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Mobile / Tablet Navigation Toggle — now covers up to lg */}
          <Sheet>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="lg:hidden" />}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 sm:max-w-sm">
              <div className="flex flex-col h-full">
                <div className="py-6">
                  <Logo href="/dashboard" showText={true} />
                </div>

                <nav className="flex-1 space-y-2">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                          }`}
                      >
                        <Icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>

                <div className="border-t border-border pt-6 pb-2">
                  <div className="mb-4 px-3 text-sm font-medium text-muted-foreground">
                    Logged in as <br />
                    <span className="text-foreground">{currentUser?.name}</span>
                  </div>
                  <Button variant="outline" className="w-full justify-start gap-2" onClick={logout}>
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}