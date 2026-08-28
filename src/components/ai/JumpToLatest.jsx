import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function JumpToLatest({ onClick }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
      <Button
        size="sm"
        variant="secondary"
        onClick={onClick}
        className="pointer-events-auto gap-1.5 shadow-md"
      >
        <ArrowDown className="h-3.5 w-3.5" />
        Jump to latest
      </Button>
    </div>
  );
}