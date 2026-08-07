import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

export default function SearchToolbar({
  value,
  onChange,
  placeholder = "Search...",
  children,
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-9"
        />
      </div>

      {children}
    </div>
  );
}
