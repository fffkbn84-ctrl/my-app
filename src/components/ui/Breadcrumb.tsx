import { Fragment } from "react";
import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

const SITE_ORIGIN = "https://www.kinda-futari.app";

function BreadcrumbStructuredData({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => {
      const entry: Record<string, unknown> = {
        "@type": "ListItem",
        position: i + 1,
        name: item.label,
      };
      if (item.href) {
        entry.item = item.href.startsWith("http")
          ? item.href
          : `${SITE_ORIGIN}${item.href}`;
      }
      return entry;
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  if (!items.length) return null;

  return (
    <>
      <nav aria-label="パンくずリスト" className="bc-nav">
        <ol className="bc-list">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <Fragment key={`${item.label}-${i}`}>
                {i > 0 && (
                  <li aria-hidden="true" className="bc-sep">
                    ›
                  </li>
                )}
                <li
                  className="bc-item"
                  {...(isLast ? { "aria-current": "page" as const } : {})}
                >
                  {item.href && !isLast ? (
                    <Link href={item.href} className="bc-link">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="bc-current">{item.label}</span>
                  )}
                </li>
              </Fragment>
            );
          })}
        </ol>
      </nav>
      <BreadcrumbStructuredData items={items} />
    </>
  );
}
