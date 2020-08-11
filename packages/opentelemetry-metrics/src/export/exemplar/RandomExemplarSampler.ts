import { Exemplar } from './Exemplar';
import { ExemplarSampler } from './ExemplarSampler';

export class RandomExemplarSampler implements ExemplarSampler {
    _k: number;
    _sampleSet: Exemplar[];
    _randCount: number;
    
    constructor(k: number) {
        this._k = k;
        this._randCount = 0;
        this._sampleSet = [];
    }

    sample(exemplar: Exemplar): void {
        this._randCount += 1;

        if (this._sampleSet.length < this._k) {
            this._sampleSet.push(exemplar);
        }

        const replaceIndex: number = Math.floor(Math.random() * this._randCount);

        if (replaceIndex < this._k) {
            this._sampleSet[replaceIndex] = exemplar;
        }
    }

    sampleSet(): Exemplar[] {
        return this._sampleSet;
    }

    merge(set1: Exemplar[], set2: Exemplar[]): Exemplar[] {
        return set2;
    }

    reset(): void {
        this._randCount = 0;
        this._sampleSet = [];
    }
}