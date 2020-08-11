import { Exemplar } from './Exemplar';

export interface ExemplarSampler {
    _k: number;
    _sampleSet: Exemplar[];

    sample(exemplar: Exemplar): void;

    sampleSet(): Exemplar[];

    merge(set1: Exemplar[], set2: Exemplar[]): Exemplar[];

    reset(): void;
}