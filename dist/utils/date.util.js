"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateUtil = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
const TIMEZONE = 'Asia/Kolkata';
exports.DateUtil = {
    nowUTC() {
        return (0, dayjs_1.default)().utc().toDate();
    },
    nowIST() {
        return (0, dayjs_1.default)().tz(TIMEZONE);
    },
    parseISTToUTC(dateString) {
        if (!dateString)
            return (0, dayjs_1.default)().utc().toDate();
        if (dateString.includes('T'))
            return (0, dayjs_1.default)(dateString).utc().toDate();
        return dayjs_1.default.tz(dateString, 'YYYY-MM-DD', TIMEZONE).startOf('day').utc().toDate();
    },
    startOfDayIST(date) {
        if (typeof date === 'string') {
            return dayjs_1.default.tz(date, 'YYYY-MM-DD', TIMEZONE).startOf('day').utc().toDate();
        }
        const d = date || (0, dayjs_1.default)().toDate();
        return (0, dayjs_1.default)(d).tz(TIMEZONE).startOf('day').utc().toDate();
    },
    endOfDayIST(date) {
        if (typeof date === 'string') {
            return dayjs_1.default.tz(date, 'YYYY-MM-DD', TIMEZONE).endOf('day').utc().toDate();
        }
        const d = date || (0, dayjs_1.default)().toDate();
        return (0, dayjs_1.default)(d).tz(TIMEZONE).endOf('day').utc().toDate();
    },
    formatToIST(date, format = 'DD MMM YYYY') {
        if (!date)
            return '';
        return (0, dayjs_1.default)(date).tz(TIMEZONE).format(format);
    }
};
//# sourceMappingURL=date.util.js.map