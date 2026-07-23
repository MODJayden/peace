import { cn } from "@/lib/utils";

export function Avatar({ src, alt, name = "", size = 40, className }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        style={{ width: size, height: size }}
        className={cn("rounded-full object-cover border border-line", className)}
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "flex items-center justify-center rounded-full bg-ink text-paper font-semibold font-mono",
        className
      )}
    >
      <span style={{ fontSize: size * 0.4 }}>{initials || "?"}</span>
    </div>
  );
}
