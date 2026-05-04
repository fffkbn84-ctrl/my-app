import type { Metadata } from "next";
import Link from "next/link";
import { getAllColumns, type ColumnMeta } from "@/lib/columns";
import ColumnsClient from "./ColumnsClient";

export const metadata: Metadata = {
  title: "コラム | Kinda ふたりへ",
  description:
    "結婚相談所・婚活に関する取材レポートやデートプランガイドを掲載。Kinda ふたりへスタッフが実際に足を運んで書いています。",
};

export default async function ColumnsPage() {
  const columns = await getAllColumns();

  return <ColumnsClient columns={columns} />;
}
