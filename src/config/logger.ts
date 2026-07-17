/**
 * ============================================================================
 * KZDI Talent OS Enterprise v3.0
 * KZDI Intelligence Gateway (KIG)
 * ----------------------------------------------------------------------------
 * File: src/config/logger.ts
 *
 * Enterprise Structured Logger
 *
 * Features
 * - JSON structured logs
 * - Log levels
 * - Request IDs
 * - Trace IDs
 * - Metadata support
 * - Production-safe logging
 * ============================================================================
 */

import { env } from "./env";

export type LogLevel =
  | "debug"
  | "info"
  | "warn"
  | "error";

export interface LogContext {
  requestId?: string;
  traceId?: string;
  provider?: string;
  candidateId?: string;
  service?: string;
  operation?: string;
  metadata?: Record<string, unknown>;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  context?: LogContext;
  error?: unknown;
}

class Logger {

  private readonly service: string;

  constructor(service: string) {
    this.service = service;
  }

  private write(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: unknown
  ): void {

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      service: this.service,
      message,
      context,
      error
    };

    const output = JSON.stringify(entry);

    switch (level) {

      case "debug":

        if (env.DEBUG) {
          console.debug(output);
        }

        break;

      case "info":

        console.info(output);

        break;

      case "warn":

        console.warn(output);

        break;

      case "error":

        console.error(output);

        break;

    }

  }

  debug(
    message: string,
    context?: LogContext
  ): void {

    this.write("debug", message, context);

  }

  info(
    message: string,
    context?: LogContext
  ): void {

    this.write("info", message, context);

  }

  warn(
    message: string,
    context?: LogContext
  ): void {

    this.write("warn", message, context);

  }

  error(
    message: string,
    error?: unknown,
    context?: LogContext
  ): void {

    this.write(
      "error",
      message,
      context,
      error
    );

  }

}

/**
 * Factory function.
 */
export function createLogger(
  service: string
): Logger {

  return new Logger(service);

}

/**
 * Default application logger.
 */
export const logger =
  createLogger("TalentOS");
