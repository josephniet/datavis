import gsap from 'gsap';
import { CanvasComponent } from './CanvasComponent';
import { ChartVisualiser } from './ChartVisualiser';
import { GridVisualiser } from './GridVisauliser';
import type { ChartState } from '../types';
type Chart = GridVisualiser | ChartVisualiser;

export class AnimationController {
    private chart: Chart;
    private state: ChartState = { progress: 0 };
    private activeTween: gsap.core.Tween | null = null;
    private tickerCallback: ((time: number, deltaTime: number) => void) | null = null;

    constructor(chart: Chart) {
        this.chart = chart;
    }

    playIntro(duration = 2): gsap.core.Tween {
        return this.tweenTo(1, duration);
    }

    playOutro(duration = 2): gsap.core.Tween {
        return this.tweenTo(0, duration);
    }

    stop() {
        this.activeTween?.kill();
        this.stopLoop();
    }

    destroy() {
        this.stop();
    }
    get currentProgress() {
        return this.state.progress;
    }

    private tweenTo(target: number, duration: number): gsap.core.Tween {
        this.activeTween?.kill();
        this.startLoop();

        const tween = gsap.to(this.state, {
            progress: target,
            duration,
            ease: 'power2.inOut',
            onComplete: () => this.stopLoop(),
        });

        this.activeTween = tween;
        return tween;
    }

    private startLoop() {
        if (this.tickerCallback) return;
        this.tickerCallback = () => {
            this.chart.render(this.state);
        };
        gsap.ticker.add(this.tickerCallback);
    }

    private stopLoop() {
        if (!this.tickerCallback) return;
        gsap.ticker.remove(this.tickerCallback);
        this.tickerCallback = null;
    }
}