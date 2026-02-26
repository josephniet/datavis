import { BaseCanvasVisualizer, type CanvasSize } from './BaseCanvasVisualizer.js';
import { getData, subscribe } from '../store/visualiserStore.js';

const MIN_R = 4;
const MAX_R = 48;
const PADDING = 20;

export class BubbleVisualizer extends BaseCanvasVisualizer {
  private unsubscribe: (() => void) | null = null;

  connectedCallback(): void {
    super.connectedCallback();
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

    const innerW = width - 2 * PADDING;
    const innerH = height - 2 * PADDING;
    const centerX = width / 2;
    const centerY = height / 2;

    data.forEach((point, i) => {
      const t = Math.max(0, Math.min(1, point.value));
      const radius = MIN_R + t * (MAX_R - MIN_R);
      const angle = (i / data.length) * Math.PI * 2 - Math.PI / 2;
      const dist = Math.min(innerW, innerH) * 0.35 * (0.4 + 0.6 * (i % 3) / 2);
      const x = centerX + Math.cos(angle) * dist;
      const y = centerY + Math.sin(angle) * dist;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, '#7c3aed');
      gradient.addColorStop(0.6, '#a78bfa');
      gradient.addColorStop(1, '#c4b5fd');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }
}

if (!customElements.get('bubble-vis')) {
  customElements.define('bubble-vis', BubbleVisualizer);
}
