export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: 'Monthly' | 'Quarterly' | 'Yearly';
  joinDate: string;
  expiryDate: string;
  feeStatus: 'Paid' | 'Pending';
  avatar?: string;
}

export type FeeStatus = 'Paid' | 'Pending';
export type PlanType = 'Monthly' | 'Quarterly' | 'Yearly';
