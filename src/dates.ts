const MSEC_PER_DAY = 24 * 60 * 60 * 1000;

export function statusDates(day: number, first: Date): Date[] {  // Default to Friday
    const tsToday: number = MSEC_PER_DAY * Math.floor(((new Date()).getTime() / MSEC_PER_DAY));
    const today = new Date(tsToday);
    const tsAdjust = (today.getDay() === day)
        ? (MSEC_PER_DAY * (today.getDay() - day + 6)) + 1
        : (MSEC_PER_DAY * (today.getDay() - day - 1)) + 1;
    const tsLast = tsToday - tsAdjust;
    const dts: Date[] = [];
    for (let i = tsLast; i >= first.getTime(); i -= (7 * MSEC_PER_DAY)) {
        dts.push(new Date(i));
    }
    return dts;
}

export function strDate(dt: Date | string): string {
    const d: Date = (typeof dt === 'string') ? new Date(dt) : dt;
    return d.toISOString().split('T')[0];
}
