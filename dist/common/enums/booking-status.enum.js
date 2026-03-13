"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundStatus = exports.PaymentType = exports.BookingStatus = void 0;
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "PENDING";
    BookingStatus["CONFIRMED"] = "CONFIRMED";
    BookingStatus["CANCELLED"] = "CANCELLED";
    BookingStatus["COMPLETED"] = "COMPLETED";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
var PaymentType;
(function (PaymentType) {
    PaymentType["ONLINE"] = "ONLINE";
    PaymentType["OFFLINE"] = "OFFLINE";
    PaymentType["PARTIAL"] = "PARTIAL";
})(PaymentType || (exports.PaymentType = PaymentType = {}));
var RefundStatus;
(function (RefundStatus) {
    RefundStatus["NONE"] = "NONE";
    RefundStatus["REQUESTED"] = "REQUESTED";
    RefundStatus["APPROVED"] = "APPROVED";
    RefundStatus["REJECTED"] = "REJECTED";
    RefundStatus["PROCESSED"] = "PROCESSED";
})(RefundStatus || (exports.RefundStatus = RefundStatus = {}));
//# sourceMappingURL=booking-status.enum.js.map