export abstract class CanvasComponent extends HTMLElement {
    protected canvas!: HTMLCanvasElement;
    protected ctx!: CanvasRenderingContext2D;
    private resizeObserver!: ResizeObserver;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.initCanvas();
        this.setupResizeObserver();
        requestAnimationFrame(() => this.resizeCanvas());
    }

    disconnectedCallback() {
        this.resizeObserver.disconnect();
    }

    private initCanvas() {
        if (!this.shadowRoot) return;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d')!;
        const style = document.createElement('style');
        style.textContent = `
            :host { display: block; width: 100%; height: 100%; min-height: 120px; }
            canvas { display: block; width: 100%; height: 100%; }
        `;
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.canvas);
    }

    private setupResizeObserver() {
        this.resizeObserver = new ResizeObserver(() => {
            this.resizeCanvas();
            this.onResize();
        });
        this.resizeObserver.observe(this);
    }

    protected resizeCanvas() {
        const rect = this.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const dpr = window.devicePixelRatio || 1;
        const width = Math.floor(rect.width * dpr);
        const height = Math.floor(rect.height * dpr);

        // Only reassign if something actually changed
        if (this.canvas.width === width && this.canvas.height === height) return;

        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height}px`;
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    protected onResize() {
        this.render({ progress: this.controller?.currentProgress ?? 0 });
    }

    protected get width() { return this.canvas.width; }
    protected get height() { return this.canvas.height; }

    protected abstract render(state: ChartState): void;
}