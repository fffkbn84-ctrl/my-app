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
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  email: string;
  phone: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  gender: "female" | "male" | "";
  message: string;
}

export interface BookingState {
  step: 1 | 2 | 3 | 4;
  selectedDate: string | null;
  selectedSlot: Slot | null;
  userInfo: BookingUserInfo;
}
