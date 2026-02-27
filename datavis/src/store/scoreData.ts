function decimalise(value: number, max: number, min: number = 0, inverse: boolean = false): number {
    if (max <= min) return 0;
    const ratio = Math.round(Math.min(Math.max((value - min) / (max - min), 0), 1) * 100) / 100;
    return inverse ? Math.round((1 - ratio) * 100) / 100 : ratio;
}
class LevelScoreData {
    readonly level: number;
    readonly score: number;
    readonly speed: number;
    readonly accuracy: number;
    // private points: number;
    // private pointsAvailable: number;
    // private timeTaken: number;
    // private timeAvailable: number;
    // private answersCorrect: number;
    // private answersTotal: number;
    constructor(
        level: number,
        points: number,
        pointsAvailable: number,
        timeTaken: number,
        timeAvailable: number,
        answersCorrect: number,
        answersTotal: number,
    ) {
        this.level = level;
        this.score = decimalise(points, pointsAvailable);
        this.speed = decimalise(timeTaken, timeAvailable, 10, true);
        this.accuracy = decimalise(answersCorrect, answersTotal);
        // this.points = points;
        // this.pointsAvailable = pointsAvailable;
        // this.timeTaken = timeTaken;
        // this.timeAvailable = timeAvailable;
        // this.answersCorrect = answersCorrect;
        // this.answersTotal = answersTotal;
    }
}
const level1 = new LevelScoreData(1, 10, 100, 30, 90, 9, 12);
const level2 = new LevelScoreData(2, 100, 100, 0, 90, 12, 12);
const level3 = new LevelScoreData(2, 0, 100, 200, 90, 0, 12);

const scoreData = [level1, level2, level3];

console.log(scoreData);

export { scoreData };