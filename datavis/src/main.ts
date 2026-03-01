import './style.css'
import { GridVisualiser } from './components/GridVisauliser.ts';
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
    switch (level) {
        case '1':
            setData(scoreData[0]);
            break;
        case '2':
            setData(scoreData[1]);
            break;
        case '3':
            setData(scoreData[2]);
            break;
        case '4':
            setData(scoreData[3]);
            break;
        case '5':
            setData(scoreData[4]);
            break;
        case 'end':
            break;
        //not yet handled, this is a different kind of visualiser
    }
})
setData(scoreData[0]);

function setData(levelData: LevelResults) {
    // console.log('setting data for level', levelData.level, levelData)
    const visualiser = document.querySelector('grid-visualiser') as GridVisualiser;
    visualiser.setData(levelData);
    scoreStats.setData(levelData);
    exampleCode.innerHTML = JSON.stringify(levelData, null, 4);
}
