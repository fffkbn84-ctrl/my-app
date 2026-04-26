"use client";

import { useState } from "react";
import { Counselor } from "@/lib/data";
import CounselorReelCard from "./CounselorReelCard";
import CounselorReelModal from "./CounselorReelModal";

type Props = {
  counselors: Counselor[];
};

export default function CounselorReelGrid({ counselors }: Props) {
  const [openCounselor, setOpenCounselor] = useState<Counselor | null>(null);
  return (
    <>
      <div className="kt-grid">
        {counselors.map((c) => (
          <CounselorReelCard key={c.id} counselor={c} onOpen={setOpenCounselor} />
        ))}
      </div>
      <CounselorReelModal counselor={openCounselor} onClose={() => setOpenCounselor(null)} />
    </>
  );
}
