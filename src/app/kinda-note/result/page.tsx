import { Suspense } from "react";
import ResultContent from "./ResultContent";

export const metadata = {
  title: "Kinda note 結果",
};

export default function KindaNoteResultPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#F5EEE6" }} />}>
      <ResultContent />
    </Suspense>
  );
}
