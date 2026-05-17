export type SlotStatus = "open" | "locked" | "booked";

export interface Slot {
  id: string;
  date: string;       // "YYYY-MM-DD"
  startTime: string;  // "HH:MM"
  endTime: string;
  status: SlotStatus;
  meetingType?: "対面" | "オンライン";
}

export interface BookingUserInfo {
  fullName: string;
  fullNameKana: string;
  age: string;
  prefecture: string;
  email: string;
  meetingFormat: "対面" | "オンライン" | "";
  message: string;
  /** 024 — 予約時に共有する Kinda type 結果（NULL = 共有しない） */
  sharedKindaTypeKey?: "A" | "B" | "C" | "D" | null;
  sharedKindaTypeAt?: string | null;
  /** 024 — 予約時に共有する Kinda note 結果（NULL = 共有しない） */
  sharedKindaNoteKey?: string | null;
  sharedKindaNoteAt?: string | null;
}

export interface BookingState {
  step: 1 | 2 | 3 | 4;
  selectedDate: string | null;
  selectedSlot: Slot | null;
  userInfo: BookingUserInfo;
}
