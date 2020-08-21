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
import {
  MinMaxExemplarSampler,
  BucketedExemplarSampler,
  ExemplarManager,
  Exemplar,
} from '../../../src/export/exemplar/';
import { hrTime } from '@opentelemetry/core';

describe('BucketedExemplarSampler', () => {
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
  describe('.sample() and .takeCheckpoint()', () => {
    it('should sample statistical BucketedExemplarSampler properly', () => {
      const boundaries = [1, 2];
      const manager = new ExemplarManager(
        {
          exemplarCount: 1,
          semanticExemplarSampler: BucketedExemplarSampler,
          statisticalExemplarSampler: BucketedExemplarSampler,
          statistical: true,
        },
        boundaries
      );

      const droppedLabels1 = { label1: 'val1' };
      const droppedLabels2 = { label2: 'val2' };
      manager.sample(5, droppedLabels1, 0);
      manager.sample(6, droppedLabels1, 0);
      manager.sample(8, droppedLabels2, 1);

      const checkpoint = manager.takeCheckpoint();
      assert.strictEqual(checkpoint[0].value, 6);
      assert.strictEqual(checkpoint[0].droppedLabels, droppedLabels1);
      assert.strictEqual(checkpoint[0].sampleCount, 2);

      assert.strictEqual(checkpoint[1].value, 8);
      assert.strictEqual(checkpoint[1].droppedLabels, droppedLabels2);
      assert.strictEqual(checkpoint[1].sampleCount, 1);
    });
  });

  it('should merge following the exemplar sampler implementation', () => {
    const manager = new ExemplarManager({
      exemplarCount: 1,
      semanticExemplarSampler: MinMaxExemplarSampler,
      statisticalExemplarSampler: MinMaxExemplarSampler,
      statistical: false,
    });

    const set1 = [new Exemplar(0, hrTime(), new Exemplar(1, hrTime()))];
    const set2 = [new Exemplar(2, hrTime(), new Exemplar(3, hrTime()))];

    assert.strictEqual(manager.merge(set1, set2), set2);
  });
});
