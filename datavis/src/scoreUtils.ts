import type { LevelResults, LevelStats } from "./types";

function decimalise(value: number, max: number, min: number = 0, inverse: boolean = false): number {
    if (max <= min) return 0;
    const ratio = Math.round(Math.min(Math.max((value - min) / (max - min), 0), 1) * 100) / 100;
    return inverse ? Math.round((1 - ratio) * 100) / 100 : ratio;
}


export function calculateLevelStats(data: LevelResults): LevelStats {
    const scoreDecimal = decimalise(data.points, data.pointsAvailable),
        speedDecimal = decimalise(data.timeTaken, data.timeAvailable, 10, true),
        accuracyDecimal = decimalise(data.answersCorrect, data.answersTotal);
    const combinedDecimal = Math.round(100 * (scoreDecimal * 0.333 + speedDecimal * 0.333 + accuracyDecimal * 0.333)) / 100;
    return {
        scoreDecimal,
        speedDecimal,
        accuracyDecimal,
        combinedDecimal
    }
}
