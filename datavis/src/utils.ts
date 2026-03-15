export function segmentProgress(global: number, i: number, count: number, stagger = 0.15): number {
    const windowSize = 1 - stagger * (count - 1);
    const start = i * stagger;
    return Math.min(1, Math.max(0, (global - start) / windowSize))
}