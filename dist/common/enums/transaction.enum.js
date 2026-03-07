"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionStatus = exports.TransactionType = void 0;
var TransactionType;
(function (TransactionType) {
    TransactionType["PAYMENT"] = "PAYMENT";
    TransactionType["REFUND"] = "REFUND";
    TransactionType["MANUAL_CREDIT"] = "MANUAL_CREDIT";
    TransactionType["MANUAL_DEBIT"] = "MANUAL_DEBIT";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "PENDING";
    TransactionStatus["SUCCESS"] = "SUCCESS";
    TransactionStatus["FAILED"] = "FAILED";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
//# sourceMappingURL=transaction.enum.js.map