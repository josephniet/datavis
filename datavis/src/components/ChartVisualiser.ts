import { calculateLevelStats } from "../scoreUtils";
import type { LevelData, LevelResults } from "../types";
import { AnimationController } from "./AnimationController";
import { CanvasComponent } from "./CanvasComponent";
import type { ChartState } from "../types";
import { segmentProgress } from "../utils";

export class ChartVisualiser extends CanvasComponent {
    private lastState: ChartState = { progress: 0 }
    gameData: LevelData[] | null = null;
    public controller: AnimationController | null = null;
    setData(gameResults: LevelResults[]) {
        this.gameData = gameResults.map(calculateLevelStats);
        this.controller = new AnimationController(this);
    }

    // The only public method the controller needs to know about
    render(state: ChartState) {
        this.lastState = state;
        const { gameData } = this;
        if (!gameData?.length) return;
        // const { progress } = state;
        const cell = Math.min(this.width, this.height);
        const cx = this.width / 2;
        const cy = this.height / 2;
        const cellRadius = cell / 2;
        const ringWidth = 5;
        const innerRadius = cellRadius - ringWidth * 2;
        const angleStep = (Math.PI * 2) / gameData.length;
        const ctx = this.ctx;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        console.log('rendering', this.width, this.height, state);

        gameData.forEach((levelData, i) => {
            const progress = segmentProgress(state.progress, i, gameData.length, 0.6 / gameData.length)
            const scale = levelData.stats.scoreDecimal;
            const sweepRatio = levelData.stats.speedDecimal;
            const startAngle = i * angleStep;
            const radius = scale * innerRadius;

            ctx.save();
            ctx.translate(cx, cy);
            ctx.fillStyle = levelData.style.color;
            ctx.strokeStyle = levelData.style.color;

            //inner circle
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius * progress, startAngle, startAngle + angleStep);
            ctx.closePath();
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.fill();

            //outer circle
            ctx.beginPath();
            ctx.arc(0, 0, cellRadius - ringWidth / 2, startAngle, startAngle + angleStep * sweepRatio * progress);
            ctx.lineWidth = ringWidth;
            ctx.stroke();

            ctx.restore();
        });
    }
    protected onResize(): void {
        this.render(this.lastState);
    }
}
customElements.define('chart-visualiser', ChartVisualiser)