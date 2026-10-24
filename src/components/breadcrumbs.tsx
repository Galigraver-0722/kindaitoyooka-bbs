import Link from "next/link";

export type BreadcrumbItem = {
  href?: string;
  label: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-[0.1em] text-muted"
    >
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-2">
          {index > 0 ? (
            <span aria-hidden="true" className="text-line">
              /
            </span>
          ) : null}
          {item.href ? (
            <Link
              href={item.href}
              className="inline-block max-w-[22rem] truncate align-bottom transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ) : (
            <span className="inline-block max-w-[22rem] truncate align-bottom text-ink">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
