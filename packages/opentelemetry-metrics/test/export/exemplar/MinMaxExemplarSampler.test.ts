import * as assert from 'assert';
import { Exemplar } from '../../../src/export/exemplar/Exemplar';
import { MinMaxExemplarSampler } from '../../../src/export/exemplar/MinMaxExemplarSampler';

describe('MinMaxExemplarSampler', ()=> {
    const date = new Date();

    it('should sample properly', () => {
        const sampler = new MinMaxExemplarSampler();
        const exemplar0 = new Exemplar(0, date.getTime());
        const exemplar1 = new Exemplar(1, date.getTime());
        const exemplar2 = new Exemplar(2, date.getTime());
        const exemplar3 = new Exemplar(3, date.getTime());

        sampler.sample(exemplar1);
        assert.strictEqual(sampler.sampleSet().length, 1);
        assert.strictEqual(sampler.sampleSet()[0], exemplar1);

        // if min and max are the same the sampler should keep one copy
        sampler.sample(exemplar1);
        assert.strictEqual(sampler.sampleSet().length, 1);
        assert.strictEqual(sampler.sampleSet()[0], exemplar1);

        sampler.sample(exemplar2);
        assert.strictEqual(sampler.sampleSet().length, 2);
        assert.strictEqual(sampler.sampleSet()[0], exemplar1);
        assert.strictEqual(sampler.sampleSet()[1], exemplar2);

        sampler.sample(exemplar3);
        assert.strictEqual(sampler.sampleSet().length, 2);
        assert.strictEqual(sampler.sampleSet()[0], exemplar1);
        assert.strictEqual(sampler.sampleSet()[1], exemplar3);

        sampler.sample(exemplar0);
        assert.strictEqual(sampler.sampleSet().length, 2);
        assert.strictEqual(sampler.sampleSet()[0], exemplar0);
        assert.strictEqual(sampler.sampleSet()[1], exemplar3);
    });

    it('should reset properly', () => {
        const sampler = new MinMaxExemplarSampler();
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
        const sampler = new MinMaxExemplarSampler();
        const set1 = [new Exemplar(0, date.getTime(), new Exemplar(1, date.getTime()))];
        const set2 = [new Exemplar(2, date.getTime(), new Exemplar(3, date.getTime()))];
        assert.strictEqual(set2, sampler.merge(set1, set2));
    });
});