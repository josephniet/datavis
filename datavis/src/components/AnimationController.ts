import gsap from 'gsap';
import type { ChartVisualiser } from './ChartVisualiser';
import type { GridVisualiser } from './GridVisauliser';
type Chart = GridVisualiser | ChartVisualiser;


export class AnimationController {
    private state = { progress: 0 };

    // connect() {
    //     gsap.ticker.add(this.tick);
    // }
    // disconnect() {
    //     gsap.ticker.remove(this.tick)
    // }
    constructor(private chart: Chart) {
        gsap.ticker.add(this.tick);
        const count = (gsap.ticker as any)._listeners?.length ?? 0;

        console.log("GSAP ticker callbacks:", count, (gsap.ticker as any)._listeners);
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