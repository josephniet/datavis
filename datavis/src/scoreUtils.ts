import type { LevelData, LevelResults } from "./types";
import { levelConfig } from "./store/levelConfig";

function decimalise(value: number, max: number, min: number = 0, inverse: boolean = false): number {
    if (max <= min) return 0;
    const ratio = Math.round(Math.min(Math.max((value - min) / (max - min), 0), 1) * 100) / 100;
    return inverse ? Math.round((1 - ratio) * 100) / 100 : ratio;
}


export function calculateLevelStats(levelResults: LevelResults): LevelData {
    const scoreDecimal = decimalise(levelResults.points, levelResults.pointsAvailable),
        speedDecimal = decimalise(levelResults.timeTaken, levelResults.timeAvailable, 10, true),
        accuracyDecimal = decimalise(levelResults.answersCorrect, levelResults.answersTotal);
    const combinedDecimal = Math.round(100 * (scoreDecimal * 0.333 + speedDecimal * 0.333 + accuracyDecimal * 0.333)) / 100;
    return {
        config: levelConfig[levelResults.level],
        results: levelResults,
        stats: {
            scoreDecimal,
            speedDecimal,
            accuracyDecimal,
            combinedDecimal,
        },
        style: {
            color: levelConfig[levelResults.level].color,
            colorSecondary: levelConfig[levelResults.level].colorSecondary,
            shape: levelConfig[levelResults.level].shape
        }
    }

}
