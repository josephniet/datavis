import { calculateLevelStats } from "../scoreUtils";
import type { LevelData, LevelResults } from "../types";
import { BaseCanvasVisualizer, type CanvasSize } from "./BaseCanvasVisualiser";


export class ChartVisualiser extends BaseCanvasVisualizer {
    gameData: LevelData[] | null = null;
    setData(gameResults: LevelResults[]): void {
        function transformData(levelResult: LevelResults): LevelData {
            return calculateLevelStats(levelResult)
        }
        this.gameData = gameResults.map(transformData);
        //
        // this.draw(this.ctx, { width: this.canvas.width, height: this.canvas.height });
        this.requestRender()
    }

    protected draw(ctx: CanvasRenderingContext2D, size: CanvasSize): void {
        const gameData = this.gameData;
        if (!gameData?.length) {
            console.warn('No game data found')
            return;
        }
        const unit = Math.min(size.width, size.height) / 100;
        const cellSize = Math.min(size.width, size.height);
        const segments = gameData.length
        const cx = size.width / 2;
        const cy = size.height / 2;
        const cellRadius = cellSize / 2;
        const ringWidth = unit * 5;
        const innerRadius = cellRadius - ringWidth * 2;
        const angleStep = (Math.PI * 2) / segments;

        gameData.forEach((levelData: LevelData, i: number) => {
            const scale = levelData.stats.scoreDecimal;
            const sweepRatio = levelData.stats.speedDecimal;
            const startAngle = i * angleStep
            const endAngle = startAngle + angleStep;
            const radius = scale * innerRadius;
            ctx.fillStyle = levelData.style.color;
            ctx.strokeStyle = levelData.style.color;
            ctx.save();
            ctx.translate(cx, cy)
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.lineWidth = 1;
            ctx.stroke()
            ctx.fill();
            ctx.beginPath();
            ctx.arc(0, 0, cellRadius - ringWidth / 2, startAngle, startAngle + angleStep * sweepRatio)
            ctx.lineWidth = ringWidth;
            ctx.stroke()
            ctx.restore()

        })
    }
}

customElements.define('chart-visualiser', ChartVisualiser)