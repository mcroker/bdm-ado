/**
 * Splits an array into an array of smaller arrays with no more chunkSize elements
 * 
 * @param a         The array to split
 * @param chunkSize The maximum number of elements in each chunk
 * @returns         A chunked array, of arrays T[] => T[][]
 */
export function chunkArray<T>(a: T[], chunkSize: number): T[][] {
    // Map this into an array of number
    const batchedWorkItems: T[][] = [];
    for (let i = 0; i < a.length; i += chunkSize) {
        const chunk = a.slice(i, i + chunkSize);
        batchedWorkItems.push(chunk);
    }
    return batchedWorkItems;
}

/**
 * Converts a date to a string in 'YYYY-MM-DD' format
 * 
 * @param dt Date
 * @returns  string in 'YYYY-MM-DD' format 
 */
export function strDate(dt: Date | string): string {
    const d: Date = (typeof dt === 'string') ? new Date(dt) : dt;
    return d.toISOString().split('T')[0];
}

const MSEC_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Generates a set of dates, one week apart - all on the specified dayofWeek.
 * Dates are in the range [first]...[the most recent occurance of dayofWeek]
 * 
 * @param dayofWeek The day of them week for status dates - 5=Friday. 
 * @param first     The first date to include in the response
 * @returns         An array of Dates
 */
export function statusDates(dayofWeek: number, first: Date): Date[] {  // Default to Friday
    const tsToday: number = MSEC_PER_DAY * Math.floor(((new Date()).getTime() / MSEC_PER_DAY));
    const today = new Date(tsToday);
    // If today is status date - then use last week's (as today is half-finished)
    const tsAdjust = (today.getDay() === dayofWeek)
        ? (MSEC_PER_DAY * (today.getDay() - dayofWeek + 6)) + 1
        : (MSEC_PER_DAY * (today.getDay() - dayofWeek - 1)) + 1;
    const tsLast = tsToday - tsAdjust;
    const dts: Date[] = [];
    for (let i = tsLast; i >= first.getTime(); i -= (7 * MSEC_PER_DAY)) {
        dts.push(new Date(i));
    }
    return dts;
}