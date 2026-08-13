import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getShopById } from "@/lib/data";
import ShopReviewForm from "./ShopReviewForm";

/**
 * お店の口コミ投稿ページ。
 *
 * 以前はクライアント側で placesHomeData（mock・id は "1" 等）を引いていたため、
 * 本番の shops（id は UUID）では必ず notFound になっていた。
 * Supabase から実データを引く server component に変え、フォームへ実 id を渡す。
 */
export const metadata: Metadata = {
  title: "口コミを投稿する | Kinda ふたりへ",
  robots: { index: false, follow: false },
};

export default async function ShopReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shop = await getShopById(id);
  if (!shop) notFound();

  return (
    <ShopReviewForm
      shopId={id}
      shopName={shop.name}
      shopLocation={shop.location ?? ""}
      shopCategory={shop.categoryLabel ?? ""}
    />
  );
}
