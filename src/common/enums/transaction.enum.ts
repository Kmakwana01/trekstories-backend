export enum TransactionType {
    PAYMENT = 'PAYMENT',
    REFUND = 'REFUND',
    MANUAL_CREDIT = 'MANUAL_CREDIT',
    MANUAL_DEBIT = 'MANUAL_DEBIT',
}

export enum TransactionStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
}
