"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function MedicalRecordSearchBar({ value, onChange }) {
  return (
    <div className="relative w-full" data-testid="medical-record-search-bar">
      <Search 
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" 
        aria-hidden="true" 
      />
      <Input
        type="text"
        placeholder="Search reason, diagnosis, vet..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 pr-9 bg-card shadow-sm"
        aria-label="Search medical records"
        data-testid="search-input"
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onClick={() => onChange("")}
          aria-label="Clear search"
          data-testid="clear-search-btn"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}