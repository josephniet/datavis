import { BaseCanvasVisualizer, type CanvasSize } from "./BaseCanvasVisualiser";
import type { LevelStats, LevelResults, LevelStyle, LevelData, Shapes, CellStyle } from "../types";
import { calculateLevelStats } from "../scoreUtils";
import type { DrawShape } from "./drawShapes";


type gridConfig = {
    cellSize: number,
    cellCount: number,
    columns: number,
    rows: number,
    gap: number,
}



function getGridConfig(size: CanvasSize): gridConfig {
    const targetCellSize = 54;
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



function getCellStyle(index: number, graphData: graphData, levelStyle: LevelData["style"]) {
    let cellStyle: CellStyle = {
        opacity: 1,
        color: 'white',
        scale: 1,
        shape: levelStyle.shape
    }
    if (index < graphData.score) cellStyle.color = 'green';
    if (index >= graphData.speed) cellStyle.scale = 0.5;
    if (index >= graphData.accuracy) cellStyle.opacity = 0.5;

    return cellStyle
}



export class GridVisualiser extends BaseCanvasVisualizer {
    // scoreData: LevelStats | null = null;
    levelData: LevelData | null = null;
    connectedCallback(): void {
        super.connectedCallback();
        console.log('grid visualiser connected')
        this.draw(this.ctx, { width: this.canvas.width, height: this.canvas.height });
    }

    setData(levelResults: LevelResults): void {
        this.levelData = calculateLevelStats(levelResults);
        console.log('data set for grid visualiser', this.levelData)
        this.draw(this.ctx, { width: this.canvas.width, height: this.canvas.height });
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

                const shapeDrawers: Record<Shapes, DrawShape> = {
                    circle: drawCircle,
                    square: drawRoundedSquare,
                    triangle: drawTriangle,
                    diamond: drawDiamond,
                    pentagon: drawPentagon
                },
                    // drawCircle(ctx, x, y, cellSize, LevelStyle);
                    drawIrregularPentagon();
                // drawDiamond(ctx, x, y, cellSize, LevelStyle);
                // drawRoundedSquare(ctx, x, y, cellSize, LevelStyle);
                // drawTriangle(ctx, x, y, cellSize, LevelStyle);
                ctx.fillStyle = LevelStyle.color;
                ctx.globalAlpha = LevelStyle.opacity;
                // ctx.scale(LevelStyle.scale, LevelStyle.scale);
                ctx.fill();
                i++;
            }
        }
    }
}

console.log('grid visualiser loaded')
customElements.define('grid-visualiser', GridVisualiser)