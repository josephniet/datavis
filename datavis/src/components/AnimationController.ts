import gsap from 'gsap';
import { CanvasComponent } from './CanvasComponent';
import { ChartVisualiser } from './ChartVisualiser';
import { GridVisualiser } from './GridVisauliser';
import type { ChartState } from '../types';
type Chart = GridVisualiser | ChartVisualiser;


export class AnimationController {
    private state = { progress: 0 };

    constructor(private chart: Chart) {
        gsap.ticker.add(this.tick);
        const count = (gsap.ticker as any)._listeners?.length ?? 0;

        console.log("GSAP ticker callbacks:", count);
    }

    private tick = () => {
        this.chart.render({ progress: this.state.progress });
    };

    playIntro(duration = 2): gsap.core.Tween {
        return gsap.to(this.state, {
            progress: 1,
            duration,
            ease: 'power2.inOut',
        });
    }

    playOutro(duration = 2): gsap.core.Tween {
        return gsap.to(this.state, {
            progress: 0,
            duration,
            ease: 'power2.inOut',
        });
    }

    get currentProgress() {
        return this.state.progress;
    }

    destroy() {
        gsap.ticker.remove(this.tick);
    }
}