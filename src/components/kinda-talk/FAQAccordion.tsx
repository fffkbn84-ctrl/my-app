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
      {items.map((item, i) => {
        const open = openIndex === i;
        const qId = `kt-faq-q-${i}`;
        const aId = `kt-faq-a-${i}`;
        return (
          <div key={i} className={`kt-faq-item ${open ? "is-open" : ""}`}>
            <button
              type="button"
              id={qId}
              className="kt-faq-q"
              aria-expanded={open}
              aria-controls={aId}
              onClick={() => setOpenIndex(open ? null : i)}
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
                aria-hidden="true"
              >
                <line x1="7" y1="2" x2="7" y2="12" />
                <line x1="2" y1="7" x2="12" y2="7" />
              </svg>
            </button>
            <div
              id={aId}
              className="kt-faq-a"
              role="region"
              aria-labelledby={qId}
              hidden={!open}
            >
              {item.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}
