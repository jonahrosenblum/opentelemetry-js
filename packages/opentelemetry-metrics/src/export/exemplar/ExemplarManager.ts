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
import { ExemplarManagerConfig } from '../types';
import {
  ValueType,
  context,
  SpanContext,
  TraceFlags,
} from '@opentelemetry/api';
import { hrTime, getActiveSpan } from '@opentelemetry/core';

export class ExemplarManager {
  private _exemplarCount: number;
  private _recordExemplars: boolean;
  private _statistical: boolean;
  private _exemplarSampler: ExemplarSampler;

  constructor(config: ExemplarManagerConfig, ...largs: any[]) {
    this._exemplarCount = config.exemplarCount | 0;
    this._recordExemplars = this._exemplarCount > 0;
    this._statistical = config.statistical;
    this._exemplarSampler = config.statistical
      ? new config.statisticalExemplarSampler(
          this._exemplarCount,
          this._statistical,
          largs
        )
      : new config.semanticExemplarSampler(
          this._exemplarCount,
          this._statistical,
          largs
        );
  }

  sample(
    value: ValueType,
    droppedLabels?: Record<string, any>,
    ...largs: any[]
  ): void {
    // TODO: insert better logic for determining if sampling should happen for semantic exemplars here
    // (this is a portion I was not able to fully figure out in the time I had)
    const ctxt: SpanContext | undefined = getActiveSpan(
      context.active()
    )?.context();
    const isSampled: boolean = ctxt?.traceFlags === TraceFlags.SAMPLED;

    if (this._recordExemplars && (isSampled || this._statistical)) {
      this._exemplarSampler.sample(
        new Exemplar(
          value,
          hrTime(),
          droppedLabels,
          ctxt?.spanId,
          ctxt?.traceId
        ),
        largs
      );
    }
  }

  takeCheckpoint(): Exemplar[] {
    let checkpoint: Exemplar[] = [];
    if (this._recordExemplars) {
      checkpoint = this._exemplarSampler.sampleSet();
      this._exemplarSampler.reset();
    }
    return checkpoint;
  }

  merge(
    checkpointExemplars: Exemplar[],
    otherCheckpointExemplars: Exemplar[]
  ): Exemplar[] {
    let ret: Exemplar[] = [];
    if (this._recordExemplars) {
      ret = this._exemplarSampler.merge(
        checkpointExemplars,
        otherCheckpointExemplars
      );
    }
    return ret;
  }
}
