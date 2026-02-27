import { scoreData } from './scoreData.ts';
export type VisualiserDataPoint = {
    id: string;
    value: number;
    label?: string;
};

export type ScoreData = {
    points: number;
    speed: number;
    accuracy: number;
}

export type VisualiserDataset = VisualiserDataPoint[];

type Subscriber = () => void;

let currentData: VisualiserDataset = [];
const subscribers = new Set<Subscriber>();

function notify(): void {
    subscribers.forEach((fn) => fn());
}

export function setData(data: VisualiserDataset): void {
    currentData = [...data];
    notify();
}

export function getData(): VisualiserDataset {
    return currentData;
}

export function subscribe(fn: Subscriber): () => void {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
}

// Demo data for testing visualisers
const demoData: VisualiserDataset = Array.from({ length: 64 }, (_, i) => ({
    id: `point-${i}`,
    value: 0.2 + Math.random() * 0.8,
    label: `Item ${i + 1}`,
}));



setData(demoData);