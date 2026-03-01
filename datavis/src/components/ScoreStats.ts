import type { LevelResults, LevelStats, LevelData } from "../types";
import { calculateLevelStats } from "../scoreUtils";
export class ScoreStats extends HTMLElement {
    setData(levelResults: LevelResults): void {
        const levelData = calculateLevelStats(levelResults)
        const levelStats = levelData.stats;
        const row = (val: number, max: number, decimal: number) => {
            const percent = Math.round(decimal * 100);
            const html = `<div>
                <span class="value">${val}</span>
                <span class="max">/${max}</span>
                <span class="percent">(${percent}%)</span>
            </div>`
            return html;
        }
        this.innerHTML = `
        <div class="score"><span class="label">Score:</span>${row(levelResults.points, levelResults.pointsAvailable, levelStats.scoreDecimal)}</div>
        <div class="speed"><span class="label">Speed:</span>${row(levelResults.timeTaken, levelResults.timeAvailable, levelStats.speedDecimal)}</div>
        <div class="accuracy"><span class="label">Accuracy:</span>${row(levelResults.answersCorrect, levelResults.answersTotal, levelStats.accuracyDecimal)}</div>
        <div class="combined">
            <span class="label">Combined:</span>
            <div>
                <span class="percent">${levelStats.combinedDecimal * 100}%</span>
            </div>
        </div>
        `
    }
}

customElements.define('score-stats', ScoreStats)