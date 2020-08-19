import * as assert from 'assert';
import { Exemplar } from '../../../src/export/exemplar/Exemplar';
import { BucketedExemplarSampler } from '../../../src/export/exemplar/BucketedExemplarSampler';

describe('BucketedExemplarSampler', ()=> {
    const date = new Date();
    let mathRandom: () => number;

    beforeEach(() => {
        mathRandom = Math.random;
        Math.random = () => { return 0 };
    });

    afterEach(() => {
        Math.random = mathRandom;
    });

    it('should sample randomly', () => {
        const sampler = new BucketedExemplarSampler(1, [2, 4, 7]);
        const exemplar0 = new Exemplar(0, date.getTime());
        const exemplar1 = new Exemplar(1, date.getTime());
        const exemplar2 = new Exemplar(2, date.getTime());
        const exemplar3 = new Exemplar(2, date.getTime());

        sampler.sample(exemplar1, 1);
        assert.strictEqual(sampler.sampleSet().length, 1);
        assert.strictEqual(sampler.sampleSet()[0], exemplar1);

        sampler.sample(exemplar2, 2);
        assert.strictEqual(sampler.sampleSet().length, 2);
        assert.strictEqual(sampler.sampleSet()[1], exemplar2);

        sampler.sample(exemplar3, 3);
        assert.strictEqual(sampler.sampleSet().length, 3);
        assert.strictEqual(sampler.sampleSet()[2], exemplar3);

        sampler.sample(exemplar0, 0);
        assert.strictEqual(sampler.sampleSet().length, 4);
        assert.strictEqual(sampler.sampleSet()[0], exemplar0);
        assert.strictEqual(sampler.sampleSet()[1], exemplar1);
        assert.strictEqual(sampler.sampleSet()[2], exemplar2);
        assert.strictEqual(sampler.sampleSet()[3], exemplar3);
    });

    it('should reset properly', () => {
        const sampler = new BucketedExemplarSampler(2, [2, 4]);
        const exemplar0 = new Exemplar(0, date.getTime());
        const exemplar1 = new Exemplar(1, date.getTime());
        
        sampler.sample(exemplar0, 0);
        sampler.sample(exemplar1, 0);
        assert.strictEqual(sampler.sampleSet().length, 2);

        sampler.reset(); 
        assert.strictEqual(sampler.sampleSet().length, 0);

        sampler.sample(exemplar1, 2);
        assert.strictEqual(sampler.sampleSet().length, 1);
    });

    it('should merge properly', () => {
        const sampler = new BucketedExemplarSampler(2);
        const set1 = [new Exemplar(0, date.getTime(), new Exemplar(1, date.getTime()))];
        const set2 = [new Exemplar(2, date.getTime(), new Exemplar(3, date.getTime()))];
        assert.strictEqual(set2, sampler.merge(set1, set2));
    });
});