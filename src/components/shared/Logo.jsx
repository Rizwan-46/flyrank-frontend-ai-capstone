import Link from "next/link";
import Image from "next/image";

export default function Logo({ href = "/", className = "" }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 transition-opacity hover:opacity-80 ${className}`}
      aria-label="Pet Care Management Home"
    >
      <div className="relative h-15 w-24 shrink-0 overflow-hidden rounded-md">
        <Image 
          src="/pet_logo.png" 
          alt="Pet Care Management Logo" 
          fill
          className="object-contain"
          priority
        />
      </div>
    </Link>
  );
}