export enum TransactionType {
    ONLINE_RECEIPT = 'ONLINE_RECEIPT',
    OFFLINE_PAYMENT = 'OFFLINE_PAYMENT',
    REFUND = 'REFUND',
    MANUAL_ADJUSTMENT = 'MANUAL_ADJUSTMENT',
}

export enum TransactionStatus {
    PENDING = 'PENDING', // Used for receipts under review
    SUCCESS = 'SUCCESS', // Verified/Approved
    FAILED = 'FAILED', // Rejected
}
