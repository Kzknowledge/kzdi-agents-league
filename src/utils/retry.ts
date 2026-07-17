/**
 * ============================================================================
 * KZDI Talent OS Enterprise v3.0
 * KZDI Intelligence Gateway (KIG)
 * ----------------------------------------------------------------------------
 * File: src/utils/retry.ts
 *
 * Enterprise Retry Utility
 *
 * Features
 * - Exponential backoff
 * - Configurable retry attempts
 * - Retry predicates
 * - Jitter support
 * - Timeout support
 * - Structured logging
 * ============================================================================
 */

import { env } from "../config/env";
import { createLogger } from "../config/logger";

const logger = createLogger("Retry");

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  jitter?: boolean;
  retryIf?: (error: unknown) => boolean;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: env.AI_MAX_RETRIES,
  initialDelayMs: env.AI_RETRY_BACKOFF_MS,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
  jitter: true,
  retryIf: () => true
};

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function calculateDelay(
  attempt: number,
  options: Required<RetryOptions>
): number {

  let delay =
    options.initialDelayMs *
    Math.pow(options.backoffMultiplier, attempt);

  delay = Math.min(delay, options.maxDelayMs);

  if (options.jitter) {
    const jitter = Math.random() * delay * 0.25;
    delay += jitter;
  }

  return Math.round(delay);

}

/**
 * Execute an async function with retries.
 */
export async function retry<T>(
  operation: () => Promise<T>,
  options?: RetryOptions
): Promise<T> {

  const config = {
    ...DEFAULT_OPTIONS,
    ...options
  };

  let lastError: unknown;

  for (
    let attempt = 0;
    attempt <= config.maxRetries;
    attempt++
  ) {

    try {

      if (attempt > 0) {

        logger.info("Retry attempt", {
          metadata: {
            attempt
          }
        });

      }

      return await operation();

    } catch (error) {

      lastError = error;

      if (!config.retryIf(error)) {

        logger.warn(
          "Retry aborted by predicate."
        );

        throw error;

      }

      if (attempt >= config.maxRetries) {

        logger.error(
          "Maximum retry attempts exceeded.",
          error
        );

        break;

      }

      const delay = calculateDelay(
        attempt,
        config
      );

      logger.warn(
        `Retrying in ${delay} ms`,
        {
          metadata: {
            attempt,
            delay
          }
        }
      );

      await sleep(delay);

    }

  }

  throw lastError;

}

/**
 * Retry only transient network errors.
 */
export function isTransientError(
  error: unknown
): boolean {

  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    message.includes("timeout") ||
    message.includes("network") ||
    message.includes("connection") ||
    message.includes("429") ||
    message.includes("503") ||
    message.includes("502") ||
    message.includes("504")
  );

}
