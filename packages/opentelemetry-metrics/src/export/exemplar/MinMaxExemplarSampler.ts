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

export class MinMaxExemplarSampler implements ExemplarSampler {
  _k: number;
  _sampleSet: Exemplar[];

  constructor(k: number) {
    this._k = k;
    this._sampleSet = [];
  }

  sample(exemplar: Exemplar): void {
    this._sampleSet.push(exemplar);
    this._sampleSet.sort((a, b) => {
      return a.value - b.value;
    });
    this._sampleSet = [
      this._sampleSet[0],
      this._sampleSet[this._sampleSet.length - 1],
    ];

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
