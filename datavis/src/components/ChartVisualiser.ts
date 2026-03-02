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
        this.draw(this.ctx, { width: this.canvas.width, height: this.canvas.height });
    }
    protected draw(ctx: CanvasRenderingContext2D, size: CanvasSize): void {
        const gameData = this.gameData;
        if (!gameData?.length) {
            console.warn('No game data found')
            return;
        }
        const cellSize = Math.min(size.width, size.height);
        const segments = gameData.length
        /*
        divide 360 into 5
        set as level N
        get color of the level
        draw an arc with a radius determined by scoreDecimel
        */
        //    const obj = {
        //        angleStart:0,
        //        angleEnd: 0,
        //        color:'string',
        //        scale: 1,
        //        progress: 0.5
        //    }
        const cx = size.width / 2;
        const cy = size.height / 2;
        const cellRadius = cellSize / 2;
        const outerRingWidth = 20;
        const innerRadius = cellRadius - outerRingWidth * 2;
        const angleStep = (Math.PI * 2) / segments;

        gameData.forEach((levelData: LevelData, i: number) => {
            const scale = levelData.stats.scoreDecimal;
            const sweepRatio = levelData.stats.speedDecimal;
            const startAngle = i * angleStep
            const endAngle = startAngle + angleStep;
            const radius = scale * innerRadius;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = levelData.style.color;
            // ctx.fillStyle = `hsl(${(i / segments) * 360}, 70%, 50%)`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(cx, cy, cellRadius, startAngle, startAngle + angleStep * sweepRatio)
            ctx.lineWidth = 25;
            ctx.strokeStyle = levelData.style.color;
            ctx.stroke()

        })

        // for (let i = 0; i < segments; i++) {
        //     const startAngle = i * angleStep - Math.PI / 2;
        //     const endAngle = startAngle + angleStep;
        //     ctx.beginPath();
        //     ctx.moveTo(cx, cy);
        //     ctx.arc(cx, cy, radius, startAngle, endAngle);
        //     ctx.closePath();
        //     ctx.fillStyle = `hsl(${(i / segments) * 360}, 70%, 50%)`;
        //     ctx.fill();
        // }

    }
}

customElements.define('chart-visualiser', ChartVisualiser)