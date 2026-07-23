import { cn } from "@/lib/utils";

export function TableOfContents({ items }) {
  if (!items || items.length === 0) return null;

  const handleClick = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="rounded-lg border border-line bg-surface p-5" aria-label="Table of contents">
      <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">In this article</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.id} className={cn(item.level === 3 && "pl-3")}>
            <a
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className="text-sm text-ink-soft hover:text-accent transition-colors line-clamp-2"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
