import { DIAGNOSIS_TYPES, type DiagnosisTypeId } from "@/lib/diagnosis";

type Props = {
  type: DiagnosisTypeId;
};

/** Kinda type（4タイプ）のうち、このカウンセラーと相性の良いタイプを示すバッジ */
export default function KindaTypeBadge({ type }: Props) {
  const t = DIAGNOSIS_TYPES[type];
  if (!t) return null;
  return (
    <span className="kt-type-badge" data-type={type}>
      <span className="kt-type-badge-dot" style={{ background: t.color }} />
      {t.shortName}
    </span>
  );
}
