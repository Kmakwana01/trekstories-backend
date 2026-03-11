export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum PaymentType {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  PARTIAL = 'PARTIAL',
}

export enum RefundStatus {
  NONE = 'NONE',
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PROCESSED = 'PROCESSED',
}
