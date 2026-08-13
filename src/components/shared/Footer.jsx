import Link from "next/link";

export default function Footer() {
  return (
    <footer 
      className="mt-auto border-t border-border bg-muted/40 py-8 text-sm text-muted-foreground"
      aria-label="Site Footer"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
        <nav aria-label="Footer Links" className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link href="/about" className="transition-colors hover:text-foreground">
            About Us
          </Link>
          <Link href="/contact" className="transition-colors hover:text-foreground">
            Contact
          </Link>
          <Link href="/privacy-policy" className="transition-colors hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-foreground">
            Terms & Conditions
          </Link>
        </nav>
        
        <p className="text-center sm:text-right">
          © {new Date().getFullYear()} Pet Care Management. All rights reserved.
        </p>
      </div>
    </footer>
  );
}