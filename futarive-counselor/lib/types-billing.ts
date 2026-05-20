export type BillingStatus = 'pending' | 'confirmed' | 'voided' | 'disputed'

export interface BillingEvent {
  id: string
  reservation_id: string
  agency_id: string
  counselor_id: string | null
  amount_jpy: number
  status: BillingStatus
  grace_until: string
  reservation_at: string
  void_reason: string | null
  confirmed_at: string | null
  voided_at: string | null
  dispute_note: string | null
  dispute_at: string | null
  admin_resolved_by: string | null
  admin_resolved_at: string | null
  admin_note: string | null
  created_at: string
  updated_at: string
}
