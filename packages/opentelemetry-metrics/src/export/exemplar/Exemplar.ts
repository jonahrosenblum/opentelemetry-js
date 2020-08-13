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
import { ValueType } from '@opentelemetry/api';

export class Exemplar {
  value: ValueType;
  timestamp: number;
  droppedLabels: Object | undefined;
  spanId: string | undefined;
  traceId: string | undefined;
  sampleCount: number | undefined;

  constructor(
    value: ValueType,
    timestamp: number,
    droppedLabels: Object | undefined = undefined,
    spanId: string | undefined = undefined,
    traceId: string | undefined = undefined,
    sampleCount: number | undefined = undefined
  ) {
    this.value = value;
    this.timestamp = timestamp;
    this.droppedLabels = droppedLabels;
    this.spanId = spanId;
    this.traceId = traceId;
    this.sampleCount = sampleCount;
  }
}
