/* 統括管理画面用モックデータ（後でSupabaseに差し替え） */

export type ReviewSourceType = "face_to_face" | "proxy";

export type AdminReview = {
  id: string;
  counselorName: string;
  agencyName: string;
  rating: number;
  body: string;
  sourceType: ReviewSourceType;
  userName: string | null;
  createdAt: string;
};

export type AdminReservation = {
  id: string;
  counselorName: string;
  agencyName: string;
  userName: string;
  userEmail: string;
  slotDate: string;
  status: "confirmed" | "cancelled";
  revenue: number;
  createdAt: string;
};

export type AdminAgency = {
  id: string;
  name: string;
  counselorCount: number;
  reservationCount: number;
  reviewCount: number;
  avgRating: number;
  joinedAt: string;
};

export type AdminStats = {
  totalReservations: number;
  monthlyReservations: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalReviews: number;
  totalAgencies: number;
  totalCounselors: number;
};

export const adminStats: AdminStats = {
  totalReservations: 312,
  monthlyReservations: 47,
  totalRevenue: 3120000,
  monthlyRevenue: 470000,
  totalReviews: 248,
  totalAgencies: 24,
  totalCounselors: 86,
};

export const adminReviews: AdminReview[] = [
  {
    id: "r1",
    counselorName: "田中 美咲",
    agencyName: "ハーモニー結婚相談所",
    rating: 5,
    body: "初回面談からとても丁寧に話を聞いてくださいました。婚活の方向性が明確になり、安心して進められています。",
    sourceType: "face_to_face",
    userName: "M.K.",
    createdAt: "2026-03-20",
  },
  {
    id: "r2",
    counselorName: "佐藤 健一",
    agencyName: "ブライダルサポート東京",
    rating: 4,
    body: "的確なアドバイスをいただけました。少し忙しそうな印象でしたが、質問には丁寧に答えていただけました。",
    sourceType: "face_to_face",
    userName: "Y.T.",
    createdAt: "2026-03-18",
  },
  {
    id: "r3",
    counselorName: "山田 裕子",
    agencyName: "縁結びクラブ",
    rating: 5,
    body: "プロフィール作成から見直してくださり、その後マッチング数が大幅に増えました。プロの力を感じました。",
    sourceType: "proxy",
    userName: null,
    createdAt: "2026-03-15",
  },
  {
    id: "r4",
    counselorName: "中村 拓也",
    agencyName: "ハーモニー結婚相談所",
    rating: 3,
    body: "面談の時間が短く感じました。もう少し個別の状況を深く聞いてほしかったです。",
    sourceType: "face_to_face",
    userName: "A.S.",
    createdAt: "2026-03-12",
  },
  {
    id: "r5",
    counselorName: "林 さくら",
    agencyName: "マリアージュクラブ",
    rating: 5,
    body: "温かみのある対応でとても話しやすく、気づけば2時間近く話していました。次回の面談も楽しみです。",
    sourceType: "face_to_face",
    userName: "K.N.",
    createdAt: "2026-03-10",
  },
];

export const adminReservations: AdminReservation[] = [
  {
    id: "res1",
    counselorName: "田中 美咲",
    agencyName: "ハーモニー結婚相談所",
    userName: "山本 花子",
    userEmail: "hanako@example.com",
    slotDate: "2026-03-22 14:00",
    status: "confirmed",
    revenue: 10000,
    createdAt: "2026-03-20",
  },
  {
    id: "res2",
    counselorName: "佐藤 健一",
    agencyName: "ブライダルサポート東京",
    userName: "鈴木 太郎",
    userEmail: "taro@example.com",
    slotDate: "2026-03-21 11:00",
    status: "confirmed",
    revenue: 10000,
    createdAt: "2026-03-18",
  },
  {
    id: "res3",
    counselorName: "林 さくら",
    agencyName: "マリアージュクラブ",
    userName: "田村 智子",
    userEmail: "tomoko@example.com",
    slotDate: "2026-03-20 16:00",
    status: "confirmed",
    revenue: 10000,
    createdAt: "2026-03-17",
  },
  {
    id: "res4",
    counselorName: "中村 拓也",
    agencyName: "ハーモニー結婚相談所",
    userName: "大野 美歩",
    userEmail: "miho@example.com",
    slotDate: "2026-03-19 10:00",
    status: "cancelled",
    revenue: 0,
    createdAt: "2026-03-15",
  },
  {
    id: "res5",
    counselorName: "山田 裕子",
    agencyName: "縁結びクラブ",
    userName: "木村 直樹",
    userEmail: "naoki@example.com",
    slotDate: "2026-03-18 13:00",
    status: "confirmed",
    revenue: 10000,
    createdAt: "2026-03-14",
  },
  {
    id: "res6",
    counselorName: "田中 美咲",
    agencyName: "ハーモニー結婚相談所",
    userName: "橋本 由美",
    userEmail: "yumi@example.com",
    slotDate: "2026-03-17 15:00",
    status: "confirmed",
    revenue: 10000,
    createdAt: "2026-03-13",
  },
];

export const adminAgencies: AdminAgency[] = [
  {
    id: "ag1",
    name: "ハーモニー結婚相談所",
    counselorCount: 12,
    reservationCount: 98,
    reviewCount: 74,
    avgRating: 4.6,
    joinedAt: "2025-04-01",
  },
  {
    id: "ag2",
    name: "ブライダルサポート東京",
    counselorCount: 8,
    reservationCount: 67,
    reviewCount: 52,
    avgRating: 4.3,
    joinedAt: "2025-05-15",
  },
  {
    id: "ag3",
    name: "縁結びクラブ",
    counselorCount: 6,
    reservationCount: 45,
    reviewCount: 38,
    avgRating: 4.5,
    joinedAt: "2025-06-01",
  },
  {
    id: "ag4",
    name: "マリアージュクラブ",
    counselorCount: 10,
    reservationCount: 72,
    reviewCount: 58,
    avgRating: 4.7,
    joinedAt: "2025-06-20",
  },
  {
    id: "ag5",
    name: "ときめきブライダル",
    counselorCount: 5,
    reservationCount: 30,
    reviewCount: 26,
    avgRating: 4.2,
    joinedAt: "2025-08-10",
  },
];
