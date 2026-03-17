// Use concrete exports alongside type aliases so Vite never serves this as empty
export const PLAN_TYPES = ['Monthly', 'Quarterly', 'Yearly'] as const;
export const FEE_STATUSES = ['Paid', 'Pending'] as const;

export type PlanType = typeof PLAN_TYPES[number];
export type FeeStatus = typeof FEE_STATUSES[number];

export interface Member {
  _id: string;
  name: string;
  email: string;
  phone: string;
  plan: PlanType;
  joinDate: string;
  expiryDate: string;
  feeStatus: FeeStatus;
  avatar?: string;
}
