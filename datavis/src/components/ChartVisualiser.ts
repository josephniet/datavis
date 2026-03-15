import { calculateLevelStats } from "../scoreUtils";
import type { LevelData, LevelResults } from "../types";
import { AnimationController } from "./AnimationController";
import { CanvasComponent } from "./CanvasComponent";
import type { ChartState } from "../types";

export class ChartVisualiser extends CanvasComponent {
    gameData: LevelData[] | null = null;
    public controller: AnimationController | null = null;
    setData(gameResults: LevelResults[]) {
        this.gameData = gameResults.map(calculateLevelStats);
        this.controller = new AnimationController(this);
    }

    // The only public method the controller needs to know about
    render(state: ChartState) {
        const { gameData } = this;
        if (!gameData?.length) return;

        const { progress } = state;
        const cell = Math.min(this.width, this.height);
        const cx = this.width / 2;
        const cy = this.height / 2;
        const cellRadius = cell / 2;
        const ringWidth = 5;
        const innerRadius = cellRadius - ringWidth * 2;
        const angleStep = (Math.PI * 2) / gameData.length;
        const ctx = this.ctx;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        gameData.forEach((levelData, i) => {
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
}
customElements.define('chart-visualiser', ChartVisualiser)