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

export class RandomExemplarSampler implements ExemplarSampler {
  _k: number;
  _sampleSet: Exemplar[];
  _randCount: number;
  _statistical: boolean;

  constructor(k: number, statistical = false) {
    this._k = k;
    this._statistical = statistical;
    this._randCount = 0;
    this._sampleSet = [];
  }
  /**
   * We sample a random subset of a stream using "Algorithm R":
   * https://en.wikipedia.org/wiki/Reservoir_sampling#Simple_algorithm
   */
  sample(exemplar: Exemplar): void {
    this._randCount += 1;

    if (this._sampleSet.length < this._k) {
      this._sampleSet.push(exemplar);
      return;
    }

    const replaceIndex: number = Math.floor(Math.random() * this._randCount);

    if (replaceIndex < this._k) {
      this._sampleSet[replaceIndex] = exemplar;
    }
  }

  sampleSet(): Exemplar[] {
    if (this._statistical) {
      this._sampleSet.forEach(exemplar => {
        exemplar.sampleCount = this._randCount / this._sampleSet.length;
      });
    }
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
