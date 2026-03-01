export type DrawShape = (ctx: CanvasRenderingContext2D, size: number) => void;

export function drawCircle(ctx: CanvasRenderingContext2D, size: number): void {
    const radius = size / 2;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
}

export function drawRoundedSquare(ctx: CanvasRenderingContext2D, size: number): void {
    ctx.beginPath();
    const x = - size / 2;
    const y = - size / 2;
    ctx.roundRect(x, y, size, size, size / 5)
}

export function drawTriangle(ctx: CanvasRenderingContext2D, size: number): void {
    const x = - size / 2;
    const y = - size / 2;
    ctx.beginPath();
    ctx.moveTo(x, y + size)
    ctx.lineTo(x + size / 2, y)
    ctx.lineTo(x + size, y + size)
    ctx.closePath();
}

export function drawIrregularPentagon(ctx: CanvasRenderingContext2D, size: number): void {
    const x = - size / 2;
    const y = - size / 2;
    const cx = x + size / 2;
    const bottomRatio = .191;
    const yNotMiddle = y + (size * 0.38);
    const left = x;
    const right = x + size;
    const xNotRight = right - (size * bottomRatio);
    const xNotLeft = left + (size * bottomRatio);
    const top = y;
    const bottom = y + size;
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

export function drawDiamond(ctx: CanvasRenderingContext2D, size: number): void {
    const cy = 0;
    const cx = 0;
    const left = cx - size / 2;
    const right = cx + size / 2;
    const top = cy - size / 2;
    const bottom = cy + size / 2;
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
}