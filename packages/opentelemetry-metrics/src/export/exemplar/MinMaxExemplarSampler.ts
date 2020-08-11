import { Exemplar } from './Exemplar';
import { ExemplarSampler } from './ExemplarSampler';

export class MinMaxExemplarSampler implements ExemplarSampler {
    _k: number;
    _sampleSet: Exemplar[];
    
    constructor(k: number) {
        this._k = k;
        this._sampleSet = [];
    }

    sample(exemplar: Exemplar): void {
        this._sampleSet.push(exemplar);
        this._sampleSet.sort((a, b) => {return a.value - b.value});
        this._sampleSet = [this._sampleSet[0], this._sampleSet[this._sampleSet.length - 1]];

        if (this._sampleSet[0] === this._sampleSet[1]) {
            this._sampleSet = [this._sampleSet[0]];
        }
    }

    sampleSet(): Exemplar[] {
        return this._sampleSet;
    }

    merge(set1: Exemplar[], set2: Exemplar[]): Exemplar[] {
        return set2;
    }

    reset(): void {
        this._sampleSet = [];
    }
}