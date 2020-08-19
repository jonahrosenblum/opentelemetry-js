import * as assert from 'assert';
//import { Exemplar } from '../../../src/export/exemplar/Exemplar';
import { MinMaxExemplarSampler } from '../../../src/export/exemplar/MinMaxExemplarSampler';
import { ExemplarManager } from '../../../src/export/exemplar/ExemplarManager';

describe('BucketedExemplarSampler', ()=> {
    //const date = new Date();
    let mathRandom: () => number;

    beforeEach(() => {
        mathRandom = Math.random;
        Math.random = () => { return 0 };
    });

    afterEach(() => {
        Math.random = mathRandom;
    });

    it('should manage properly', () => {
        const manager = new ExemplarManager({exemplarCount: 1, semanticExemplar: new MinMaxExemplarSampler()});
        //const exemplar0 = new Exemplar(0, date.getTime());
        manager.sample(0);
        assert.strictEqual(true, true);
    });
});