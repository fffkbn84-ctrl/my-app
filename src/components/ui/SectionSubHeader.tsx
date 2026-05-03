import Link from "next/link";

export default function SectionSubHeader({
  sectionName,
  sectionRoot,
}: {
  sectionName: string;
  sectionRoot: string;
}) {
  return (
    <div className="ssh-bar">
      <Link href={sectionRoot} className="ssh-back" aria-label={`${sectionName}に戻る`}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path
            d="M9 2L4 7l5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="ssh-back-label">{sectionName}</span>
      </Link>
      <Link href="/" className="ssh-home" aria-label="ホームへ">
        ホームへ
      </Link>
    </div>
  );
}
