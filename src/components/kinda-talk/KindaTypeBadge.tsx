import { KINDA_TYPES, KindaTypeKey } from "@/lib/kinda-types";

type Props = {
  type: KindaTypeKey;
  manual?: boolean;
};

export default function KindaTypeBadge({ type, manual }: Props) {
  const t = KINDA_TYPES[type];
  if (!t) return null;
  return (
    <span className="kt-type-badge" data-type={type}>
      <span className="kt-type-badge-dot" style={{ background: t.color }} />
      {t.shortName}
      {manual && (
        <span style={{ color: "var(--mid)", marginLeft: 2, fontSize: 9 }}>+</span>
      )}
    </span>
  );
}
