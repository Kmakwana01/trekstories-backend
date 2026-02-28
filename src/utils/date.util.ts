import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Extend Day.js with necessary plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = 'Asia/Kolkata';

export const DateUtil = {
    /**
     * Returns the current date and time as a native UTC JS Date.
     */
    nowUTC(): Date {
        return dayjs().utc().toDate();
    },

    /**
     * Returns the current date and time in Asia/Kolkata formatted safely.
     */
    nowIST() {
        return dayjs().tz(TIMEZONE);
    },

    /**
     * Converts an absolute local "YYYY-MM-DD" string (assumed to be selected in IST) 
     * cleanly into a Midnight UTC JS Date.
     */
    parseISTToUTC(dateString: string): Date {
        if (!dateString) return dayjs().utc().toDate();
        // If it's already an ISO string, just return it as UTC Date
        if (dateString.includes('T')) return dayjs(dateString).utc().toDate();
        return dayjs.tz(dateString, 'YYYY-MM-DD', TIMEZONE).startOf('day').utc().toDate();
    },

    /**
     * Returns absolute UTC boundary constraints for IST "Start of Day"
     */
    startOfDayIST(date?: Date | string): Date {
        if (typeof date === 'string')
        {
            return dayjs.tz(date, 'YYYY-MM-DD', TIMEZONE).startOf('day').utc().toDate();
        }
        const d = date || dayjs().toDate();
        return dayjs(d).tz(TIMEZONE).startOf('day').utc().toDate();
    },

    /**
     * Returns absolute UTC boundary constraints for IST "End of Day"
     */
    endOfDayIST(date?: Date | string): Date {
        if (typeof date === 'string')
        {
            return dayjs.tz(date, 'YYYY-MM-DD', TIMEZONE).endOf('day').utc().toDate();
        }
        const d = date || dayjs().toDate();
        return dayjs(d).tz(TIMEZONE).endOf('day').utc().toDate();
    },

    /**
     * Formats a date to IST string
     */
    formatToIST(date: Date | string, format: string = 'DD MMM YYYY'): string {
        if (!date) return '';
        return dayjs(date).tz(TIMEZONE).format(format);
    }
};
