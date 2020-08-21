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

import {
  Point,
  AggregatorKind,
  DistributionAggregatorType,
  Distribution,
} from '../types';
import {
  ExemplarManager,
  MinMaxExemplarSampler,
  RandomExemplarSampler,
} from '../exemplar';
import { HrTime } from '@opentelemetry/api';
import { hrTime } from '@opentelemetry/core';

/**
 * Basic aggregator keeping all raw values (events, sum, max, last and min).
 */
export class MinMaxLastSumCountAggregator
  implements DistributionAggregatorType {
  public kind: AggregatorKind.DISTRIBUTION = AggregatorKind.DISTRIBUTION;
  private _distribution: Distribution;
  private _lastUpdateTime: HrTime = [0, 0];
  private _exemplarManager: ExemplarManager;

  constructor(exemplarCount = 0, statistical = false) {
    this._distribution = {
      min: Infinity,
      max: -Infinity,
      last: 0,
      sum: 0,
      count: 0,
    };
    this._exemplarManager = new ExemplarManager({
      exemplarCount: exemplarCount,
      statistical: statistical,
      semanticExemplarSampler: MinMaxExemplarSampler,
      statisticalExemplarSampler: RandomExemplarSampler,
    });
  }

  update(value: number, droppedLabels?: string[]): void {
    this._distribution.count++;
    this._distribution.sum += value;
    this._distribution.last = value;
    this._distribution.min = Math.min(this._distribution.min, value);
    this._distribution.max = Math.max(this._distribution.max, value);
    this._lastUpdateTime = hrTime();

    this._exemplarManager.sample(value, droppedLabels);
  }

  toPoint(): Point<Distribution> {
    return {
      value: this._distribution,
      timestamp: this._lastUpdateTime,
    };
  }
}
