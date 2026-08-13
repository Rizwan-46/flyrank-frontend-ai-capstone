import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle"; // Adjust path if needed

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link 
          href="/" 
          className="text-xl font-bold tracking-tight text-primary transition-opacity hover:opacity-80"
          aria-label="Pet Care Management Home"
        >
          Pet Care Management
        </Link>

        <nav aria-label="Main Navigation" className="flex items-center gap-4 sm:gap-6 text-sm font-medium">
          <Link 
            href="/about" 
            className="text-muted-foreground transition-colors hover:text-foreground hidden sm:block"
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className="text-muted-foreground transition-colors hover:text-foreground hidden sm:block"
          >
            Contact
          </Link>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="secondary" size="sm" data-testid="nav-login-btn">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}