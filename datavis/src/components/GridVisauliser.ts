import { BaseCanvasVisualizer, type CanvasSize } from "./BaseCanvasVisualiser";
import type { LevelStats, LevelResults } from "../types";
import { calculateLevelStats } from "../scoreUtils";


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
    // console.log('calculating graph data with grid config', gridConfig, 'and level stats', levelStats)
    //decide whether a cell if filled or not
    function clean(value: number): number {
        return Math.round(value * gridConfig.cellCount);
    }
    return {
        score: clean(levelStats.scoreDecimal),
        speed: clean(levelStats.speedDecimal),
        accuracy: clean(levelStats.accuracyDecimal)
    }

}

type CellStyle = {
    color: string,
    scale: number,
    opacity: number,
    shape: 'circle' | 'square' | 'triangle' | 'diamond' | 'pentagon'
}

function getCellStyle(index: number, graphData: graphData): CellStyle {
    let cellStyle = {
        color: 'lightgray',
        scale: 1,
        opacity: 1,
        shape: 'circle' as const
    }
    if (index <= graphData.score) cellStyle.color = 'green';
    if (index >= graphData.speed) cellStyle.scale = 0.5;
    if (index >= graphData.accuracy) cellStyle.opacity = 0.5;
    return cellStyle
}

function drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, cellSize: number, cellStyle: CellStyle): void {
    const radius = (cellSize / 2) * cellStyle.scale;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
}



export class GridVisualiser extends BaseCanvasVisualizer {
    scoreData: LevelStats | null = null;
    connectedCallback(): void {
        super.connectedCallback();
        console.log('grid visualiser connected')
        this.draw(this.ctx, { width: this.canvas.width, height: this.canvas.height });
    }

    setData(levelResults: LevelResults): void {
        this.scoreData = calculateLevelStats(levelResults);
        console.log('data set for grid visualiser', this.scoreData)
        this.draw(this.ctx, { width: this.canvas.width, height: this.canvas.height });
    }
    protected draw(ctx: CanvasRenderingContext2D, size: CanvasSize): void {
        if (this.scoreData === null) return; // we have no score data to visualise yet
        const { width, height } = size;
        ctx.clearRect(0, 0, width, height);
        const gridConfig = getGridConfig(size);
        const graphData = getGraphData(gridConfig, this.scoreData);
        const cellSize = gridConfig.cellSize;
        const columns = gridConfig.columns;
        const rows = gridConfig.rows;
        // const cellCount = gridConfig.cellCount;
        // const scoreDecimal = scoreData[0].scoreDecimal;
        let i = 0;
        ctx.clearRect(0, 0, width, height);
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                const cellStyle = getCellStyle(i, graphData);
                const x = col * cellSize + cellSize / 2;
                const y = row * cellSize + cellSize / 2;
                drawCircle(ctx, x, y, cellSize, cellStyle);
                ctx.fillStyle = cellStyle.color;
                ctx.globalAlpha = cellStyle.opacity;
                // ctx.scale(cellStyle.scale, cellStyle.scale);
                ctx.fill();
                i++;
            }
        }
    }
}

console.log('grid visualiser loaded')
customElements.define('grid-visualiser', GridVisualiser)