import { BaseCanvasVisualizer, type CanvasSize } from "./BaseCanvasVisualiser";
import type { LevelStats, LevelResults, LevelData, Shapes, CellStyle } from "../types";
import { calculateLevelStats } from "../scoreUtils";
import type { DrawShape } from "./drawShapes";
import { drawCircle, drawDiamond, drawIrregularPentagon, drawRoundedSquare, drawTriangle } from "./drawShapes";


type gridConfig = {
    cellSize: number,
    cellCount: number,
    columns: number,
    rows: number,
    gap: number,
}



function getGridConfig(size: CanvasSize): gridConfig {
    const unit = Math.min(size.width, size.height) / 100
    const targetCellSize = unit * 16;
    const columns = Math.floor(size.width / targetCellSize);
    const cellSize = size.width / columns;
    const rows = Math.floor(size.height / cellSize)
    return {
        cellSize: cellSize,
        cellCount: columns * rows,
        columns: columns,
        rows: rows,
        gap: 0
    }
}

type graphData = {
    score: number,
    speed: number,
    accuracy: number
}

function getGraphData(gridConfig: gridConfig, levelStats: LevelStats): graphData {
    //decide whether a cell is filled or not
    function clean(value: number): number {
        return Math.round(value * gridConfig.cellCount);
    }
    return {
        score: clean(levelStats.scoreDecimal),
        speed: clean(levelStats.speedDecimal),
        accuracy: clean(levelStats.accuracyDecimal)
    }
}

// function scaleFalloff(index: number, threshold: number): number {
//     if (threshold <= 4) return 1;
//     const distanceFromThreshold = index - threshold;
//     const scale = distanceFromThreshold <= 0 ? 1
//         : distanceFromThreshold === 1 ? 0.9
//             : distanceFromThreshold === 2 ? 0.75
//                 : 0.4;

//     return scale;
// }

function getCellStyle(index: number, graphData: graphData, levelStyle: LevelData["style"]) {
    let cellStyle: CellStyle = {
        opacity: 1,
        color: levelStyle.color,
        scale: 1,
        shape: levelStyle.shape
    }
    if (index >= graphData.score) cellStyle.opacity = 0.5;
    // if (index >= graphData.speed) cellStyle.scale = 0.4;
    // const scale = scaleFalloff(index, graphData.speed)
    // cellStyle.scale = scale;
    if (index >= graphData.speed) cellStyle.scale = 0.4;

    return cellStyle
}



export class GridVisualiser extends BaseCanvasVisualizer {
    // scoreData: LevelStats | null = null;
    levelData: LevelData | null = null;
    connectedCallback(): void {
        super.connectedCallback();
        console.log('grid visualiser connected')
        // this.draw(this.ctx, { width: this.canvas.width, height: this.canvas.height });
        this.requestRender();
    }

    setData(levelResults: LevelResults): void {
        this.levelData = calculateLevelStats(levelResults);
        console.log('data set for grid visualiser', this.levelData)
        // this.draw(this.ctx, { width: this.canvas.width, height: this.canvas.height });
        this.requestRender();
    }
    protected draw(ctx: CanvasRenderingContext2D, size: CanvasSize): void {
        if (this.levelData === null) return; // we have no score data to visualise yet
        const { width, height } = size;
        ctx.clearRect(0, 0, width, height);
        const gridConfig = getGridConfig(size);
        const graphData = getGraphData(gridConfig, this.levelData.stats);
        const cellSize = gridConfig.cellSize;
        const columns = gridConfig.columns;
        const rows = gridConfig.rows;
        // const cellCount = gridConfig.cellCount;
        // const scoreDecimal = scoreData[0].scoreDecimal;
        let i = 0;
        ctx.clearRect(0, 0, width, height);
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                const cellStyle = getCellStyle(i, graphData, this.levelData.style);
                const x = col * cellSize;
                const y = row * cellSize;
                const cx = x + cellSize / 2;
                const cy = y + cellSize / 2;

                const shapeDrawers: Record<Shapes, DrawShape> = {
                    "circle": drawCircle,
                    "square": drawRoundedSquare,
                    "triangle": drawTriangle,
                    "diamond": drawDiamond,
                    "pentagon": drawIrregularPentagon
                };
                ctx.save();
                ctx.translate(cx, cy);
                ctx.scale(cellStyle.scale, cellStyle.scale)
                shapeDrawers[this.levelData.style.shape](ctx, cellSize)
                ctx.restore()
                ctx.fillStyle = cellStyle.color;
                ctx.globalAlpha = cellStyle.opacity;
                ctx.fill();
                i++;
            }
        }
    }
}

console.log('grid visualiser loaded')
customElements.define('grid-visualiser', GridVisualiser)