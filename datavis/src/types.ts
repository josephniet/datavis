export type LevelResults = {
    level: number;
    points: number;
    pointsAvailable: number;
    timeTaken: number;
    timeAvailable: number;
    answersCorrect: number;
    answersTotal: number;
}
export type LevelStats = {
    scoreDecimal: number;
    speedDecimal: number;
    accuracyDecimal: number;
    combinedDecimal: number;
}

export type LevelStyle = {
    color: string,
    shape: Shapes
}

export type LevelData = {
    results: LevelResults,
    stats: LevelStats,
    style: LevelStyle
}

export type Shapes = "circle" | "square" | "triangle" | "diamond" | "pentagon";

export type CellStyle = {
    opacity: number,
    color: string,
    scale: number,
    shape: LevelStyle["shape"]
}