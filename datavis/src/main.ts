import './style.css'
import { GridVisualiser } from './components/GridVisauliser.ts';
import { ChartVisualiser } from './components/ChartVisualiser.ts';
import scoreData from './store/dummyScoreData.ts';
import type { LevelResults } from './types.ts';
import { ScoreStats } from './components/ScoreStats.ts';

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

function setData(levelData: LevelResults) {
    const visualiser = document.querySelector('grid-visualiser') as GridVisualiser;
    const chartVisualiser = document.querySelector('chart-visualiser') as ChartVisualiser;
    chartVisualiser.setData(scoreData)
    visualiser.setData(levelData);
    scoreStats.setData(levelData);
    exampleCode.innerHTML = JSON.stringify(levelData, null, 4);
}
