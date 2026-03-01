import type { LevelResults } from "../types"

const level1: LevelResults = {
    level: 1,
    points: 10,
    pointsAvailable: 100,
    timeTaken: 30,
    timeAvailable: 90,
    answersCorrect: 9,
    answersTotal: 12,
}
const level2: LevelResults = {
    level: 2,
    points: 100,
    pointsAvailable: 100,
    timeTaken: 0,
    timeAvailable: 90,
    answersCorrect: 12,
    answersTotal: 12,
}
const level3: LevelResults = {
    level: 3,
    points: 0,
    pointsAvailable: 100,
    timeTaken: 230,
    timeAvailable: 90,
    answersCorrect: 0,
    answersTotal: 12,
}
const level4: LevelResults = {
    level: 4,
    points: 50,
    pointsAvailable: 100,
    timeTaken: 30,
    timeAvailable: 90,
    answersCorrect: 3,
    answersTotal: 12,
}
const level5: LevelResults = {
    level: 5,
    points: 50,
    pointsAvailable: 100,
    timeTaken: 50,
    timeAvailable: 90,
    answersCorrect: 6,
    answersTotal: 12,
}

const scoreData = [level1, level2, level3, level4, level5];
export default scoreData;