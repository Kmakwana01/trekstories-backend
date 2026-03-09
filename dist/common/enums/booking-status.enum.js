"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentType = exports.BookingStatus = void 0;
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
//# sourceMappingURL=booking-status.enum.js.map