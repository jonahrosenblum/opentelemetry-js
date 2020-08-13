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
import { Exemplar } from './Exemplar';
import { ExemplarSampler } from './ExemplarSampler';
import { RandomExemplarSampler } from './RandomExemplarSampler';

export class BucketedExemplarSampler implements ExemplarSampler {
  _k: number;
  private _sampleSet: RandomExemplarSampler[];
  _boundaries: number[];

  constructor(k: number, boundaries: number[] = []) {
    this._k = k;
    this._boundaries = boundaries;
    this._sampleSet = boundaries.map(_ => new RandomExemplarSampler(k));
  }

  sample(exemplar: Exemplar, bucketIndex?: number): void {
    if (bucketIndex === undefined) {
      return;
    }
    this._sampleSet[bucketIndex].sample(exemplar);
  }

  sampleSet(): Exemplar[] {
    return [].concat.apply(
      this._sampleSet.map(sample => sample.sampleSet()),
      []
    );
  }

  merge(set1: Exemplar[], set2: Exemplar[]): Exemplar[] {
    return set2;
  }

  reset(): void {
    this._sampleSet.forEach(sampler => {
      sampler.reset();
    });
  }
}
