import dayjs from 'dayjs';
export declare const DateUtil: {
    nowUTC(): Date;
    nowIST(): dayjs.Dayjs;
    parseISTToUTC(dateString: string): Date;
    startOfDayIST(date?: Date | string): Date;
    endOfDayIST(date?: Date | string): Date;
    formatToIST(date: Date | string, format?: string): string;
};
