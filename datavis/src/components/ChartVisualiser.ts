import { calculateLevelStats } from "../scoreUtils";
import type { LevelData, LevelResults } from "../types";
import { CanvasComponent } from "./CanvasComponent";
import type { ChartState } from "../types";
import { segmentProgress } from "../utils";

export class ChartVisualiser extends CanvasComponent {
    private lastState: ChartState = { progress: 0 }
    gameData: LevelData[] | null = null;
    setData(gameResults: LevelResults[]) {
        this.gameData = gameResults.map(calculateLevelStats);
    }

    requestRender(state: ChartState) {
        requestAnimationFrame(() => this.render(state))
    }
    // The only public method the controller needs to know about
    render(state: ChartState) {
        // if (state.progress === this.lastState.progress) return;
        this.lastState = { ...state };
        const gameData = this.gameData;
        if (!gameData?.length) {
            console.warn('No game data found')
            return;
        }
        const ctx = this.ctx;
        const width = this.width
        const height = this.height
        const unit = Math.min(width, height) / 100;
        const cellSize = Math.min(width, height);
        const segments = gameData.length
        const cx = width / 2;
        const cy = height / 2;
        const cellRadius = cellSize / 2;
        const ringWidth = unit * 5;
        const innerRadius = cellRadius - ringWidth * 2;
        const angleStep = (Math.PI * 2) / segments;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        gameData.forEach((levelData: LevelData, i: number) => {
            const progress = segmentProgress(state.progress, i, gameData.length, 0.6 / gameData.length)
            const scale = levelData.stats.scoreDecimal;
            const sweepRatio = levelData.stats.speedDecimal;
            const startAngle = i * angleStep
            const endAngle = startAngle + angleStep;
            const radius = scale * innerRadius;
            ctx.fillStyle = levelData.style.color;
            ctx.strokeStyle = levelData.style.color;
            ctx.save();
            ctx.translate(cx, cy)

            //inner circle
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius * progress, startAngle, startAngle + angleStep);
            ctx.closePath();
            ctx.lineWidth = 1;
            ctx.stroke()
            ctx.fill();

            //outer circle
            ctx.beginPath();
            ctx.arc(0, 0, cellRadius - ringWidth / 2, startAngle, startAngle + angleStep * sweepRatio * progress);
            ctx.lineWidth = ringWidth;
            ctx.stroke()
            ctx.restore()

        });
    }

    protected onResize(): void {
        this.render(this.lastState);
    }
}
customElements.define('chart-visualiser', ChartVisualiser)