"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationType = void 0;
var NotificationType;
(function (NotificationType) {
    NotificationType["BOOKING_CREATED"] = "booking_created";
    NotificationType["BOOKING_CONFIRMED"] = "booking_confirmed";
    NotificationType["BOOKING_CANCELLED"] = "booking_cancelled";
    NotificationType["PAYMENT_SUCCESS"] = "payment_success";
    NotificationType["PAYMENT_FAILED"] = "payment_failed";
    NotificationType["PAYMENT_UNDER_REVIEW"] = "payment_under_review";
    NotificationType["TRIP_REMINDER"] = "trip_reminder";
    NotificationType["OFFER"] = "offer";
    NotificationType["GENERAL"] = "general";
    NotificationType["REFUND_REQUESTED"] = "refund_requested";
    NotificationType["REFUND_APPROVED"] = "refund_approved";
    NotificationType["REFUND_REJECTED"] = "refund_rejected";
    NotificationType["REFUND_PROCESSED"] = "refund_processed";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
//# sourceMappingURL=notification-type.enum.js.map