export type CanvasSize = { width: number; height: number };

export abstract class BaseCanvasVisualizer extends HTMLElement {
    protected canvas!: HTMLCanvasElement;
    protected ctx!: CanvasRenderingContext2D;
    private resizeObserver: ResizeObserver | null = null;
    private rafId: number | null = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback(): void {
        if (!this.shadowRoot) return;

        this.canvas = document.createElement('canvas');
        const style = document.createElement('style');
        style.textContent = `
      :host {
        display: block;
        width: 100%;
        height: 100%;
        min-height: 120px;
      }
      canvas {
        display: block;
        width: 100%;
        height: 100%;
      }
    `;
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.canvas);

        const ctx = this.canvas.getContext('2d');
        if (!ctx) return;
        this.ctx = ctx;

        this.resizeObserver = new ResizeObserver(() => this.scheduleResize());
        this.resizeObserver.observe(this);

        this.scheduleResize();
    }

    disconnectedCallback(): void {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    private scheduleResize(): void {
        if (this.rafId !== null) cancelAnimationFrame(this.rafId);
        this.rafId = requestAnimationFrame(() => {
            this.rafId = null;
            this.handleResize();
        });
    }

    private handleResize(): void {
        const rect = this.getBoundingClientRect();
        const dpr = window.devicePixelRatio ?? 1;
        const width = Math.floor(rect.width * dpr);
        const height = Math.floor(rect.height * dpr);

        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height}px`;

        this.draw(this.ctx, { width, height });
    }

    protected requestRender(progress: number): void {
        if (!this.canvas || !this.ctx) return;
        const { width, height } = this.canvas;
        if (width <= 0 || height <= 0) return;
        this.draw(this.ctx, { width, height }, progress);
    }

    protected abstract draw(ctx: CanvasRenderingContext2D, size: CanvasSize, progress: number): void;
}