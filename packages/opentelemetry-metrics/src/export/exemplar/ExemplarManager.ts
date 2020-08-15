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

import { ExemplarSampler } from './ExemplarSampler';
import { ExemplarManagerConfig } from '../types';

export class ExemplarManager {
    private _exemplarCount: number;
    private _recordExemplars: boolean;
    private _semanticExemplar: ExemplarSampler;
    private _config: ExemplarManagerConfig;

    constructor(config: ExemplarManagerConfig) {
        this._exemplarCount = config.exemplarCount | 0;
        this._recordExemplars = this._exemplarCount > 0;
        this._semanticExemplar = config.semanticExemplar;

    }
}
