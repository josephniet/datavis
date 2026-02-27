import { BaseCanvasVisualizer, type CanvasSize } from "./BaseCanvasVisualiser";
import { scoreData } from "../store/scoreData";
import type { LevelStats } from "../store/scoreData";


type gridConfig = {
    cellSize: number,
    cellCount: number,
    columns: number,
    rows:number,
    gap: number,
}

function getGridConfig(size:CanvasSize):gridConfig{
    const targetCellSize = 54;
    const columns = Math.floor(size.width / targetCellSize);
    const cellSize = size.width /  columns;
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

function getGraphData(gridConfig:gridConfig, levelStats:LevelStats):graphData{
    console.log('calculating graph data with grid config', gridConfig, 'and level stats', levelStats)
//decide whether a cell if filled or not
function clean(value:number):number{
    return Math.round(value * gridConfig.cellCount);
}
return {
    score: clean(levelStats.scoreDecimal),
    speed: clean(levelStats.speedDecimal),
    accuracy: (levelStats.accuracyDecimal)
}

}
function getFillStyle(index:number, graphData:graphData):string{
    if (index < graphData.score) return 'green';
    // if (index < graphData.speed) return 'orange';
    // if (index < graphData.accuracy) return 'red';
    return 'lightgray';
}

export class GridVisualiser extends BaseCanvasVisualizer {

    connectedCallback(): void {
        super.connectedCallback();
        console.log('grid visualiser connected')
        this.draw(this.ctx, {width: this.canvas.width, height: this.canvas.height});
    }
    protected draw(ctx:CanvasRenderingContext2D, size:CanvasSize):void {
        console.log('drawing grid visualiser')
        const {width,height} = size;
        ctx.clearRect(0,0,width,height);
        const gridConfig = getGridConfig(size);
        const graphData = getGraphData(gridConfig, scoreData[0]);
        const cellSize = gridConfig.cellSize;
        const columns = gridConfig.columns;
        const rows = gridConfig.rows;
        // const cellCount = gridConfig.cellCount;
        // const scoreDecimal = scoreData[0].scoreDecimal;
        const gap = gridConfig.gap;
        const shapeSize = cellSize - gap;
        const radius = shapeSize/2;
        let i = 0;
        ctx.clearRect(0,0,width,height);
        for(let row = 0; row < rows; row++){
        for (let col = 0; col < columns; col++){
                const x = col * cellSize + cellSize/2;
                const y = row * cellSize + cellSize/2;
                ctx.beginPath();
                ctx.arc(x,y,radius,0,Math.PI*2);
                ctx.fillStyle = getFillStyle(i, graphData);
                ctx.fill();
                i++;
            }
        }
    }
}

console.log('grid visualiser loaded')
customElements.define('grid-visauliser', GridVisualiser)