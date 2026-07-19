/**
 * ============================================================================
 * KZDI Talent OS Enterprise v3.0
 * Telemetry Repository
 * ----------------------------------------------------------------------------
 * File: src/database/repositories/TelemetryRepository.ts
 *
 * Responsibilities
 * - Persist telemetry events
 * - Query operational metrics
 * - Store AI request metadata
 * - Support observability dashboards
 * ============================================================================
 */

import { SupabaseClient } from "@supabase/supabase-js";

import { getServiceClient } from "../client";

import { createLogger } from "../../config/logger";

const logger = createLogger("TelemetryRepository");

export interface TelemetryEvent {

  event_type: string;

  provider?: string;

  model?: string;

  request_id?: string;

  trace_id?: string;

  success: boolean;

  latency_ms?: number;

  retries?: number;

  prompt_version?: string;

  prompt_tokens?: number;

  completion_tokens?: number;

  total_tokens?: number;

  metadata?: Record<string, unknown>;

  error?: string;

}

export class TelemetryRepository {

  constructor(
    private readonly db: SupabaseClient = getServiceClient()
  ) {}

  /**
   * Store telemetry event.
   */
  async create(
    event: TelemetryEvent
  ) {

    logger.info(
      "Recording telemetry event",
      {
        metadata: {
          event_type: event.event_type,
          provider: event.provider
        }
      }
    );

    const { data, error } =
      await this.db
        .from("telemetry_events")
        .insert({

          event_type: event.event_type,

          provider: event.provider,

          model: event.model,

          request_id: event.request_id,

          trace_id: event.trace_id,

          success: event.success,

          latency_ms: event.latency_ms,

          retries: event.retries,

          prompt_version: event.prompt_version,

          prompt_tokens: event.prompt_tokens,

          completion_tokens: event.completion_tokens,

          total_tokens: event.total_tokens,

          metadata: event.metadata,

          error: event.error,

          created_at: new Date().toISOString()

        })
        .select()
        .single();

    if (error) {

      logger.error(
        "Telemetry insert failed",
        error
      );

      throw error;

    }

    return data;

  }

  /**
   * Retrieve latest events.
   */
  async latest(
    limit = 100
  ) {

    const { data, error } =
      await this.db
        .from("telemetry_events")
        .select("*")
        .order(
          "created_at",
          {
            ascending: false
          }
        )
        .limit(limit);

    if (error) {

      throw error;

    }

    return data;

  }

  /**
   * Events by request.
   */
  async findByRequestId(
    requestId: string
  ) {

    const { data, error } =
      await this.db
        .from("telemetry_events")
        .select("*")
        .eq(
          "request_id",
          requestId
        );

    if (error) {

      throw error;

    }

    return data;

  }

  /**
   * Events by trace.
   */
  async findByTraceId(
    traceId: string
  ) {

    const { data, error } =
      await this.db
        .from("telemetry_events")
        .select("*")
        .eq(
          "trace_id",
          traceId
        );

    if (error) {

      throw error;

    }

    return data;

  }

  /**
   * AI Success Rate
   */
  async successRate() {

    const { data, error } =
      await this.db
        .from("telemetry_events")
        .select("success");

    if (error) {

      throw error;

    }

    const total = data.length;

    const successful =
      data.filter(
        item => item.success
      ).length;

    return {

      total,

      successful,

      failed: total - successful,

      successRate:
        total === 0
          ? 0
          : Number(
              (
                (successful / total) *
                100
              ).toFixed(2)
            )

    };

  }

  /**
   * Average AI latency.
   */
  async averageLatency() {

    const { data, error } =
      await this.db
        .from("telemetry_events")
        .select("latency_ms")
        .not(
          "latency_ms",
          "is",
          null
        );

    if (error) {

      throw error;

    }

    if (!data.length) {

      return 0;

    }

    const total =
      data.reduce(

        (sum, row) =>
          sum + (row.latency_ms ?? 0),

        0

      );

    return Number(
      (total / data.length)
        .toFixed(2)
    );

  }

      }
