"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBookingNumber = generateBookingNumber;
const date_util_1 = require("../../utils/date.util");
async function generateBookingNumber(model, field = 'bookingNumber') {
    const dateStr = date_util_1.DateUtil.nowIST().format('YYYYMMDD');
    const prefix = `TRV-${dateStr}-`;
    const lastBooking = await model
        .findOne({ [field]: { $regex: (key) => `^${prefix}` } })
        .sort({ [field]: -1 })
        .exec();
    const lastBookingCorrect = await model
        .findOne({ [field]: new RegExp(`^${prefix}`) })
        .sort({ [field]: -1 })
        .exec();
    let nextSequence = 1;
    if (lastBookingCorrect) {
        const lastSequenceStr = lastBookingCorrect[field].split('-').pop();
        nextSequence = parseInt(lastSequenceStr, 10) + 1;
    }
    const sequenceStr = nextSequence.toString().padStart(4, '0');
    return `${prefix}${sequenceStr}`;
}
//# sourceMappingURL=booking-number.helper.js.map