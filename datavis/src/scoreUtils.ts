import type { LevelData, LevelResults, LevelStats, Shapes, LevelStyle } from "./types";

function decimalise(value: number, max: number, min: number = 0, inverse: boolean = false): number {
    if (max <= min) return 0;
    const ratio = Math.round(Math.min(Math.max((value - min) / (max - min), 0), 1) * 100) / 100;
    return inverse ? Math.round((1 - ratio) * 100) / 100 : ratio;
}


function getShape(level: number): Shapes {
    const levelShapes: Record<number, Shapes> = {
        1: 'circle',
        2: "square",
        3: "triangle",
        4: "diamond",
        5: "pentagon"
    }
    return levelShapes[level]
}


export function calculateLevelStats(levelResults: LevelResults): LevelData {
    const scoreDecimal = decimalise(levelResults.points, levelResults.pointsAvailable),
        speedDecimal = decimalise(levelResults.timeTaken, levelResults.timeAvailable, 10, true),
        accuracyDecimal = decimalise(levelResults.answersCorrect, levelResults.answersTotal);
    const combinedDecimal = Math.round(100 * (scoreDecimal * 0.333 + speedDecimal * 0.333 + accuracyDecimal * 0.333)) / 100;
    return {
        results: levelResults,
        stats: {
            scoreDecimal,
            speedDecimal,
            accuracyDecimal,
            combinedDecimal,
        },
        style: {
            color: 'green',
            shape: getShape(levelResults.level)
        }
    }

}
