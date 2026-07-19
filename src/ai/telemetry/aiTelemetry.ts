/**
 * ============================================================================
 * KZDI Talent OS Enterprise v3.0
 * KZDI Intelligence Gateway (KIG)
 * ----------------------------------------------------------------------------
 * File: src/ai/telemetry/aiTelemetry.ts
 *
 * Enterprise AI Telemetry
 *
 * Responsibilities
 * - AI request telemetry
 * - Trace generation
 * - Structured metrics
 * - Provider analytics
 * - Future observability integration
 * ============================================================================
 */

import crypto from "crypto";
import { createLogger } from "../../config/logger";

const logger = createLogger("AITelemetry");

/**
 * AI Telemetry Record
 */
export interface AIRequestTelemetry {

  provider: string;

  model: string;

  latency_ms: number;

  success: boolean;

  retries: number;

  promptVersion?: string;

  requestId?: string;

  traceId?: string;

  promptTokens?: number;

  completionTokens?: number;

  totalTokens?: number;

  error?: string;

}

/**
 * Stored telemetry record
 */
export interface AIRequestRecord
  extends AIRequestTelemetry {

  timestamp: string;

}

/**
 * Generate request identifier
 */
export function generateRequestId(): string {

  return crypto.randomUUID();

}

/**
 * Generate trace identifier
 */
export function generateTraceId(): string {

  return crypto.randomUUID();

}

/**
 * Record AI request
 */
export async function recordAIRequest(
  telemetry: AIRequestTelemetry
): Promise<AIRequestRecord> {

  const record: AIRequestRecord = {

    ...telemetry,

    requestId:
      telemetry.requestId ??
      generateRequestId(),

    traceId:
      telemetry.traceId ??
      generateTraceId(),

    timestamp:
      new Date().toISOString()

  };

  logger.info(
    "AI Request",
    {
      provider: record.provider,
      metadata: record
    }
  );

  /**
   * ------------------------------------------------------------------------
   * Future Integrations
   * ------------------------------------------------------------------------
   *
   * await telemetryRepository.save(record)
   *
   * await OpenTelemetry.export(record)
   *
   * await SupabaseTelemetry.insert(record)
   *
   * await AzureMonitor.send(record)
   *
   */

  return record;

}

/**
 * Record successful evaluation
 */
export async function recordAISuccess(
  telemetry: Omit<
    AIRequestTelemetry,
    "success"
  >
): Promise<AIRequestRecord> {

  return recordAIRequest({

    ...telemetry,

    success: true

  });

}

/**
 * Record failed evaluation
 */
export async function recordAIFailure(
  telemetry: Omit<
    AIRequestTelemetry,
    "success"
  >
): Promise<AIRequestRecord> {

  return recordAIRequest({

    ...telemetry,

    success: false

  });

}

/**
 * Calculate token cost (placeholder).
 *
 * Can later be expanded with provider-specific
 * pricing models.
 */
export function estimateTokenUsage(
  promptTokens = 0,
  completionTokens = 0
) {

  return {

    promptTokens,

    completionTokens,

    totalTokens:
      promptTokens +
      completionTokens

  };

}
