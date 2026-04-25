"use client";

import { useState } from "react";

export type FAQItem = {
  q: string;
  a: string;
};

type Props = {
  items: FAQItem[];
};

export default function FAQAccordion({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className={`kt-faq-item ${openIndex === i ? "is-open" : ""}`}>
          <button
            type="button"
            className="kt-faq-q"
            aria-expanded={openIndex === i}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <span>{item.q}</span>
            <svg
              className="kt-faq-q-icon"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <line x1="7" y1="2" x2="7" y2="12" />
              <line x1="2" y1="7" x2="12" y2="7" />
            </svg>
          </button>
          <div className="kt-faq-a">{item.a}</div>
        </div>
      ))}
    </div>
  );
}
