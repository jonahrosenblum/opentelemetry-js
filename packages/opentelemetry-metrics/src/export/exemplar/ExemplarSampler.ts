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

/**
 * Base class for exemplar samplers.
 */
export interface ExemplarSampler {
  _k: number;
  _statistical: boolean;

  sample(exemplar: Exemplar, ...largs: any[]): void;

  sampleSet(): Exemplar[];

  merge(set1: Exemplar[], set2: Exemplar[]): Exemplar[];

  reset(): void;
}

/**
 * This interface allows us to use the ExemplarSampler interface or any child class as an argument instead of needing to pass an object.
 */
export interface ExemplarSamplerArg {
  new (k: number, statistical: boolean, ...largs: any[]): ExemplarSampler;
}
