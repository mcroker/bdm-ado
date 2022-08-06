export function batchArray<T>(a: T[], chunkSize: number): T[][] {
    // Map this into an array of number
    const batchedWorkItems: T[][] = [];
    for (let i = 0; i < a.length; i += chunkSize) {
        const chunk = a.slice(i, i + chunkSize);
        batchedWorkItems.push(chunk);
    }
    return batchedWorkItems;
}

export function strDate(dt: Date | string): string {
    const d: Date = (typeof dt === 'string') ? new Date(dt) : dt;
    return d.toISOString().split('T')[0];
}
