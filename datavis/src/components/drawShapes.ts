import type { LevelStyle, LevelData, CellStyle } from '../types'

export type DrawShape = (ctx: CanvasRenderingContext2D, cellSize: number, CellStyle: CellStyle) => void;



export function drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, cellSize: number, LevelStyle: LevelStyle): void {
    const cx = x + cellSize / 2
    const cy = y + cellSize / 2
    const radius = (cellSize / 2) * LevelStyle.scale;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
}

export function drawRoundedSquare(ctx: CanvasRenderingContext2D, x: number, y: number, cellSize: number, LevelStyle: LevelStyle): void {
    ctx.beginPath();
    ctx.roundRect(x, y, cellSize, cellSize, cellSize / 5)
}

export function drawTriangle(ctx: CanvasRenderingContext2D, x: number, y: number, cellSize: number, LevelStyle: LevelStyle): void {
    ctx.beginPath();
    ctx.moveTo(x, y + cellSize)
    ctx.lineTo(x + cellSize / 2, y)
    ctx.lineTo(x + cellSize, y + cellSize)
    ctx.closePath();
}

export function drawIrregularPentagon(ctx: CanvasRenderingContext2D, x: number, y: number, cellSize: number, LevelStyle: LevelStyle): void {
    const cx = x + cellSize / 2;
    const cy = x + cellSize / 2;
    const bottomRatio = .191;
    const yNotMiddle = y + (cellSize * 0.38);
    const left = x;
    const right = x + cellSize;
    const xNotRight = right - (cellSize * bottomRatio);
    const xNotLeft = left + (cellSize * bottomRatio);
    const top = y;
    const bottom = y + cellSize;
    const points = [
        { x: cx, y: top },
        { x: right, y: yNotMiddle },
        { x: xNotRight, y: bottom },
        { x: xNotLeft, y: bottom },
        { x: left, y: yNotMiddle }
    ]
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
    }
    ctx.closePath()
}

export function drawDiamond(ctx: CanvasRenderingContext2D, x: number, y: number, cellSize: number, LevelStyle: LevelStyle): void {
    const xCellCentre = x + cellSize / 2;
    const yCellCentre = y + cellSize / 2;
    ctx.save();
    ctx.translate(xCellCentre, yCellCentre);
    const cy = 0;
    const cx = 0;
    const left = cx - cellSize / 2;
    const right = cx + cellSize / 2;
    const top = cy - cellSize / 2;
    const bottom = cy + cellSize / 2;
    ctx.scale(LevelStyle.scale, LevelStyle.scale);
    const points = [
        { x: cx, y: top },
        { x: right, y: cy },
        { x: cx, y: bottom },
        { x: left, y: cy },
    ]
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
    }
    ctx.closePath()
    ctx.restore()
}