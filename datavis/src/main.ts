import './style.css'
import { GridVisualiser } from './components/GridVisauliser';
import { ChartVisualiser } from './components/ChartVisualiser';
import scoreData from './store/dummyScoreData';
import type { LevelResults } from './types';
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
setData(scoreData[0]);

async function setData(levelData: LevelResults) {
    const gridVisualiser = document.querySelector('grid-visualiser') as GridVisualiser;
    gridVisualiser.setData(levelData);
    const chartVisualiser = document.querySelector('chart-visualiser') as ChartVisualiser;
    chartVisualiser.setData(scoreData)
    scoreStats.setData(levelData);
    exampleCode.innerHTML = JSON.stringify(levelData, null, 4);



    //example with GSAP timeline
    // const timelineDefaults = {
    //     repeat: -1,
    //     yoyo: true,
    //     repeatDelay: 0,
    // }
    // const tlPie = gsap.timeline(timelineDefaults);
    // tlPie.add(chartVisualiser.controller!.playIntro());
    // tlPie.add(chartVisualiser.controller!.playOutro());

    // const tlGrid = gsap.timeline(timelineDefaults);
    // tlGrid.add(gridVisualiser.controller!.playIntro());
    // tlGrid.add(gridVisualiser.controller!.playOutro());

    //example just calling static

    requestAnimationFrame(() => {
        chartVisualiser.controller.destroy();
        gridVisualiser.controller.destroy();
        chartVisualiser.render({ progress: 1 });
        gridVisualiser.render({ progress: 1 });
    })
}
