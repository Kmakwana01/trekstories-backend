"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionStatus = exports.TransactionType = void 0;
var TransactionType;
(function (TransactionType) {
    TransactionType["ONLINE_RECEIPT"] = "ONLINE_RECEIPT";
    TransactionType["OFFLINE_PAYMENT"] = "OFFLINE_PAYMENT";
    TransactionType["REFUND"] = "REFUND";
    TransactionType["MANUAL_ADJUSTMENT"] = "MANUAL_ADJUSTMENT";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "PENDING";
    TransactionStatus["SUCCESS"] = "SUCCESS";
    TransactionStatus["FAILED"] = "FAILED";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
//# sourceMappingURL=transaction.enum.js.map