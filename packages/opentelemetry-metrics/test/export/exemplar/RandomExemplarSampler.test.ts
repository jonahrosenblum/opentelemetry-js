import * as assert from 'assert';
import { Exemplar } from '../../../src/export/exemplar/Exemplar';
import { RandomExemplarSampler } from '../../../src/export/exemplar/RandomExemplarSampler';

describe('RandomExemplarSampler', ()=> {
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
        const sampler = new RandomExemplarSampler(2);
        const exemplar0 = new Exemplar(0, date.getTime());
        const exemplar1 = new Exemplar(1, date.getTime());
        const exemplar2 = new Exemplar(2, date.getTime());

        sampler.sample(exemplar0);
        assert.strictEqual(sampler.sampleSet().length, 1);
        assert.strictEqual(sampler.sampleSet()[0], exemplar0);

        sampler.sample(exemplar1);
        assert.strictEqual(sampler.sampleSet().length, 2);
        assert.strictEqual(sampler.sampleSet()[0], exemplar0);
        assert.strictEqual(sampler.sampleSet()[1], exemplar1);

        sampler.sample(exemplar2);
        assert.strictEqual(sampler.sampleSet().length, 2);
        assert.strictEqual(sampler.sampleSet()[0], exemplar2);
        assert.strictEqual(sampler.sampleSet()[1], exemplar1);

        Math.random = () => { return 1 / sampler._randCount };

        sampler.sample(exemplar0);
        assert.strictEqual(sampler.sampleSet().length, 2);
        assert.strictEqual(sampler.sampleSet()[0], exemplar2);
        assert.strictEqual(sampler.sampleSet()[1], exemplar0);
    });

    it('should reset properly', () => {
        const sampler = new RandomExemplarSampler(2);
        const exemplar0 = new Exemplar(0, date.getTime());
        const exemplar1 = new Exemplar(1, date.getTime());
        
        sampler.sample(exemplar0);
        sampler.sample(exemplar1);
        sampler.reset(); 
        assert.strictEqual(sampler.sampleSet().length, 0);

        sampler.sample(exemplar1);
        assert.strictEqual(sampler.sampleSet().length, 1);
    });

    it('should merge properly', () => {
        const sampler = new RandomExemplarSampler(2);
        const set1 = [new Exemplar(0, date.getTime(), new Exemplar(1, date.getTime()))];
        const set2 = [new Exemplar(2, date.getTime(), new Exemplar(3, date.getTime()))];
        assert.strictEqual(set2, sampler.merge(set1, set2));
    });
});