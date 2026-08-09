import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LookupSelect({
  value,
  onChange,
  options = [],
  loading = false,
  placeholder = "Select an option",
  disabled = false,
  className,
}) {
  return (
    <Select
      items={options}
      value={value || null}
      onValueChange={onChange}
      disabled={disabled || loading}
    >
      <SelectTrigger className={className ?? "w-full"}>
        <SelectValue placeholder={loading ? "Loading..." : placeholder} />
      </SelectTrigger>

      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
