import './style.css'
import { GridVisualiser } from './components/GridVisauliser';
import { ChartVisualiser } from './components/ChartVisualiser';
import scoreData from './store/dummyScoreData';
import type { ChartState, LevelResults } from './types';
import { ScoreStats } from './components/ScoreStats';
import gsap from 'gsap';

//external app stuff
const levelList = document.getElementById('level-list') as HTMLElement;
const scoreStats = document.querySelector('score-stats') as ScoreStats;
const exampleCode = document.querySelector('#example-code') as HTMLElement;

levelList.addEventListener('click', (e) => {
    const button = (e.target as HTMLElement).closest('button');
    if (!button) return;
    const level = button.dataset.level;
    if (level === undefined) {
        console.warn('level is undefined');
        return
    }
    const handleStages: Record<string, () => void> = {
        1: () => setData(scoreData[0]),
        2: () => setData(scoreData[1]),
        3: () => setData(scoreData[2]),
        4: () => setData(scoreData[3]),
        5: () => setData(scoreData[4]),
        // share: () => () => { },
    };
    handleStages[level]();
})
let chartIntroAnimation: null | gsap.core.Tween = null;
let gridIntroAnimation: null | gsap.core.Tween = null;
setData(scoreData[0]);


async function setData(levelData: LevelResults) {
    const gridVisualiser = document.querySelector('grid-visualiser') as GridVisualiser;
    gridVisualiser.setData(levelData);
    const chartVisualiser = document.querySelector('chart-visualiser') as ChartVisualiser;
    chartVisualiser.setData(scoreData)
    scoreStats.setData(levelData);
    exampleCode.innerHTML = JSON.stringify(levelData, null, 4);


    //-------- example with GSAP timeline
    function chartGsapExample() {
        const animationState: ChartState = { progress: 0 }
        if (chartIntroAnimation) chartIntroAnimation.kill()
        chartIntroAnimation = gsap.to(animationState, {
            progress: 1,              // animate from current value → 1
            overwrite: true,
            duration: 2.8,
            ease: "power2.out",       // or "none" for linear scrub, "expo.out", etc.
            repeat: -1,
            repeatDelay: 1,
            yoyo: true,
            onUpdate: () => {
                chartVisualiser.render(animationState);   // redraw every frame
            },
            onComplete: () => {
                console.log("Animation finished");
            }
        })
    }


    function gridGsapExample() {
        const animationState: ChartState = { progress: 0 }
        if (gridIntroAnimation) gridIntroAnimation.kill()
        gridIntroAnimation = gsap.to(animationState, {
            progress: 1,              // animate from current value → 1
            overwrite: true,
            duration: 2.8,
            ease: "power2.out",       // or "none" for linear scrub, "expo.out", etc.
            repeat: -1,
            repeatDelay: 1,
            yoyo: true,
            onUpdate: () => {
                gridVisualiser.render(animationState);   // redraw every frame
            },
            onComplete: () => {
                console.log("Animation finished");
            },
        })
    }
    gridGsapExample()
    chartGsapExample()
    //-------- example just calling static

    // chartVisualiser.requestRender({ progress: 0.5 })
}
