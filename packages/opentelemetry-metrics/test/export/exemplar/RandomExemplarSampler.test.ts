/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as assert from 'assert';
import { Exemplar, RandomExemplarSampler } from '../../../src/export/exemplar/';
import { hrTime } from '@opentelemetry/core';

describe('RandomExemplarSampler', () => {
  let mathRandom: () => number;

  beforeEach(() => {
    mathRandom = Math.random;
    Math.random = () => {
      return 0;
    };
  });

  afterEach(() => {
    Math.random = mathRandom;
  });

  it('should sample randomly', () => {
    const sampler = new RandomExemplarSampler(2, true);
    const exemplar0 = new Exemplar(0, hrTime());
    const exemplar1 = new Exemplar(1, hrTime());
    const exemplar2 = new Exemplar(2, hrTime());

    sampler.sample(exemplar0);
    assert.strictEqual(sampler.sampleSet().length, 1);
    assert.strictEqual(sampler.sampleSet()[0], exemplar0);
    assert.strictEqual(exemplar0.sampleCount, 1);

    sampler.sample(exemplar1);
    assert.strictEqual(sampler.sampleSet().length, 2);
    assert.strictEqual(sampler.sampleSet()[0], exemplar0);
    assert.strictEqual(sampler.sampleSet()[1], exemplar1);
    assert.strictEqual(exemplar1.sampleCount, 1);

    sampler.sample(exemplar2);
    assert.strictEqual(sampler.sampleSet().length, 2);
    assert.strictEqual(sampler.sampleSet()[0], exemplar2);
    assert.strictEqual(sampler.sampleSet()[1], exemplar1);
    assert.strictEqual(exemplar2.sampleCount, 1.5);

    Math.random = () => {
      return 1 / sampler._randCount;
    };

    sampler.sample(exemplar0);
    assert.strictEqual(sampler.sampleSet().length, 2);
    assert.strictEqual(sampler.sampleSet()[0], exemplar2);
    assert.strictEqual(sampler.sampleSet()[1], exemplar0);
    assert.strictEqual(exemplar0.sampleCount, 2);
  });

  it('should reset properly', () => {
    const sampler = new RandomExemplarSampler(2);
    const exemplar0 = new Exemplar(0, hrTime());
    const exemplar1 = new Exemplar(1, hrTime());

    sampler.sample(exemplar0);
    sampler.sample(exemplar1);
    sampler.reset();
    assert.strictEqual(sampler.sampleSet().length, 0);

    sampler.sample(exemplar1);
    assert.strictEqual(sampler.sampleSet().length, 1);
  });

  it('should merge properly', () => {
    const sampler = new RandomExemplarSampler(2);
    const set1 = [new Exemplar(0, hrTime(), new Exemplar(1, hrTime()))];
    const set2 = [new Exemplar(2, hrTime(), new Exemplar(3, hrTime()))];
    assert.strictEqual(set2, sampler.merge(set1, set2));
  });
});
