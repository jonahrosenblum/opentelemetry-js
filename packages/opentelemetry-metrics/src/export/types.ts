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

import { ValueType, HrTime, Labels } from '@opentelemetry/api';
import { ExportResult, InstrumentationLibrary } from '@opentelemetry/core';
import { Resource } from '@opentelemetry/resources';
import { ExemplarSampler } from './exemplar/ExemplarSampler';

/** The kind of metric. */
export enum MetricKind {
  COUNTER,
  UP_DOWN_COUNTER,
  VALUE_RECORDER,
  SUM_OBSERVER,
  UP_DOWN_SUM_OBSERVER,
  VALUE_OBSERVER,
}

/** The kind of aggregator. */
export enum AggregatorKind {
  SUM,
  LAST_VALUE,
  DISTRIBUTION,
  HISTOGRAM,
}

/** Sum returns an aggregated sum. */
export type Sum = number;

/** LastValue returns last value. */
export type LastValue = number;

/** Distribution returns an aggregated distribution. */
export interface Distribution {
  min: number;
  max: number;
  last: number;
  count: number;
  sum: number;
}

export interface Histogram {
  /**
   * Buckets are implemented using two different array:
   *  - boundaries contains every boundary (which are upper boundary for each slice)
   *  - counts contains count of event for each slice
   *
   * Note that we'll always have n+1 (where n is the number of boundaries) slice
   * because we need to count event that are above the highest boundary. This is the
   * reason why it's not implement using array of object, because the last slice
   * dont have any boundary.
   *
   * Example if we measure the values: [5, 30, 5, 40, 5, 15, 15, 15, 25]
   *  with the boundaries [ 10, 20, 30 ], we will have the following state:
   *
   * buckets: {
   *	boundaries: [10, 20, 30],
   *	counts: [3, 3, 2, 1],
   * }
   */
  buckets: {
    boundaries: number[];
    counts: number[];
  };
  sum: number;
  count: number;
}

export type PointValueType = Sum | LastValue | Distribution | Histogram;

export interface MetricRecord {
  readonly descriptor: MetricDescriptor;
  readonly labels: Labels;
  readonly aggregator: Aggregator;
  readonly resource: Resource;
  readonly instrumentationLibrary: InstrumentationLibrary;
}

export interface MetricDescriptor {
  readonly name: string;
  readonly description: string;
  readonly unit: string;
  readonly metricKind: MetricKind;
  readonly valueType: ValueType;
}

/**
 * Base interface that represents a metric exporter
 */
export interface MetricExporter {
  /** Exports the list of a given {@link MetricRecord} */
  export(
    metrics: MetricRecord[],
    resultCallback: (result: ExportResult) => void
  ): void;

  /** Stops the exporter. */
  shutdown(): void;
}

/**
 * Base interface for aggregators. Aggregators are responsible for holding
 * aggregated values and taking a snapshot of these values upon export.
 *
 * Use {@link Aggregator} instead of this BaseAggregator.
 */
interface BaseAggregator {
  /** The kind of the aggregator. */
  kind: AggregatorKind;

  /** Updates the current with the new value. */
  update(value: number): void;
}

/** SumAggregatorType aggregate values into a {@link Sum} point type. */
export interface SumAggregatorType extends BaseAggregator {
  kind: AggregatorKind.SUM;

  /** Returns snapshot of the current point (value with timestamp). */
  toPoint(): Point<Sum>;
}

/**
 * LastValueAggregatorType aggregate values into a {@link LastValue} point
 * type.
 */
export interface LastValueAggregatorType extends BaseAggregator {
  kind: AggregatorKind.LAST_VALUE;

  /** Returns snapshot of the current point (value with timestamp). */
  toPoint(): Point<LastValue>;
}

/**
 * DistributionAggregatorType aggregate values into a {@link Distribution}
 * point type.
 */
export interface DistributionAggregatorType extends BaseAggregator {
  kind: AggregatorKind.DISTRIBUTION;

  /** Returns snapshot of the current point (value with timestamp). */
  toPoint(): Point<Distribution>;
}

/**
 * HistogramAggregatorType aggregate values into a {@link Histogram} point
 * type.
 */
export interface HistogramAggregatorType extends BaseAggregator {
  kind: AggregatorKind.HISTOGRAM;

  /** Returns snapshot of the current point (value with timestamp). */
  toPoint(): Point<Histogram>;
}

export type Aggregator =
  | SumAggregatorType
  | LastValueAggregatorType
  | DistributionAggregatorType
  | HistogramAggregatorType;

/**
 * Point represents a snapshot of aggregated values of aggregators.
 */
export interface Point<T extends PointValueType> {
  value: T;
  timestamp: HrTime;
}

export interface ExemplarManagerConfig {
  exemplarCount: number;

  semanticExemplar: ExemplarSampler;

}
