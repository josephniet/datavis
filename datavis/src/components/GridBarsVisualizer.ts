import { BaseCanvasVisualizer, type CanvasSize } from './BaseCanvasVisualizer.js';
import { getData, subscribe } from '../store/visualiserStore.js';

export type GridBarsMode = 'bars' | 'dots' | 'heatmap';

export type GridBarsModeConfig = {
  primary: string;
  secondary: string;
  shape: 'rect' | 'circle';
  cornerRadius?: number;
  lineWidth?: number;
};

export const GRID_BARS_MODES: Record<GridBarsMode, GridBarsModeConfig> = {
  bars: {
    primary: '#2563eb',
    secondary: '#93c5fd',
    shape: 'rect',
    cornerRadius: 4,
  },
  dots: {
    primary: '#059669',
    secondary: '#6ee7b7',
    shape: 'circle',
  },
  heatmap: {
    primary: '#dc2626',
    secondary: '#fbbf24',
    shape: 'rect',
    cornerRadius: 0,
  },
};

const DEFAULT_MODE: GridBarsMode = 'bars';
const CELL_SIZE_TARGET = 24;
const GAP = 2;

export class GridBarsVisualizer extends BaseCanvasVisualizer {
  static get observedAttributes(): string[] {
    return ['mode'];
  }

  private _mode: GridBarsMode = DEFAULT_MODE;
  private unsubscribe: (() => void) | null = null;

  get mode(): GridBarsMode {
    return this._mode;
  }

  set mode(value: GridBarsMode) {
    const next = GRID_BARS_MODES[value] ? value : DEFAULT_MODE;
    if (this._mode === next) return;
    this._mode = next;
    this.setAttribute('mode', next);
    this.requestRender();
  }

  attributeChangedCallback(name: string, _old: string | null, newValue: string | null): void {
    if (name === 'mode' && newValue != null && GRID_BARS_MODES[newValue as GridBarsMode]) {
      this._mode = newValue as GridBarsMode;
      this.requestRender();
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    const initialMode = this.getAttribute('mode') as GridBarsMode | null;
    if (initialMode && GRID_BARS_MODES[initialMode]) this._mode = initialMode;

    this.unsubscribe = subscribe(() => this.requestRender());
  }

  disconnectedCallback(): void {
    this.unsubscribe?.();
    this.unsubscribe = null;
    super.disconnectedCallback();
  }

  protected draw(ctx: CanvasRenderingContext2D, size: CanvasSize): void {
    const { width, height } = size;
    ctx.clearRect(0, 0, width, height);

    const data = getData();
    if (data.length === 0) return;

    const config = GRID_BARS_MODES[this._mode];
    const cellSize = CELL_SIZE_TARGET + GAP;
    const cols = Math.max(1, Math.floor(width / cellSize));
    const rows = Math.max(1, Math.floor(height / cellSize));
    const totalCells = cols * rows;
    const cellW = (width - (cols - 1) * GAP) / cols;
    const cellH = (height - (rows - 1) * GAP) / rows;

    for (let i = 0; i < totalCells; i++) {
      const value = data[i % data.length]?.value ?? 0.5;
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = col * (cellW + GAP);
      const y = row * (cellH + GAP);

      const t = Math.max(0, Math.min(1, value));
      const r = Math.min(cellW, cellH) / 2;
      const radius = config.shape === 'circle' ? r * 0.9 * (0.3 + 0.7 * t) : 0;

      ctx.save();
      if (config.shape === 'rect') {
        const h = cellH * t;
        const cy = y + cellH - h;
        ctx.fillStyle = config.primary;
        if (config.cornerRadius && config.cornerRadius > 0) {
          this.roundRect(ctx, x, cy, cellW, h, Math.min(config.cornerRadius, h / 2));
          ctx.fill();
        } else {
          ctx.fillRect(x, cy, cellW, h);
        }
      } else if (config.shape === 'circle') {
        const cx = x + cellW / 2;
        const cy = y + cellH / 2;
        ctx.fillStyle = t > 0.5 ? config.primary : config.secondary;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ): void {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}

if (!customElements.get('grid-bars-vis')) {
  customElements.define('grid-bars-vis', GridBarsVisualizer);
}
