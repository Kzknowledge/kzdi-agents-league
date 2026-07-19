/**
 * ============================================================================
 * KZDI Talent OS Enterprise v3.0
 * HTTP Telemetry Middleware
 * ----------------------------------------------------------------------------
 * File: src/middleware/telemetry.ts
 *
 * Responsibilities
 * - HTTP request telemetry
 * - Request/response metrics
 * - Structured logging
 * - Repository integration
 * ============================================================================
 */

import { Request, Response, NextFunction } from "express";

import { TelemetryRepository } from "../database/repositories/TelemetryRepository";

import { createLogger } from "../config/logger";

const logger = createLogger("TelemetryMiddleware");

const telemetryRepository = new TelemetryRepository();

/**
 * HTTP Telemetry Middleware
 */
export function telemetryMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {

  const startedAt = Date.now();

  res.on("finish", async () => {

    const latency = Date.now() - startedAt;

    try {

      await telemetryRepository.create({

        event_type: "http_request",

        success: res.statusCode < 400,

        request_id: req.requestId,

        trace_id: req.traceId,

        metadata: {

          method: req.method,

          path: req.originalUrl,

          status: res.statusCode,

          latency_ms: latency,

          ip:
            req.ip ||

            req.socket.remoteAddress ||

            "unknown",

          user_agent:
            req.get("user-agent") ||

            "unknown"

        }

      });

      logger.debug("HTTP telemetry recorded", {

        metadata: {

          requestId: req.requestId,

          method: req.method,

          path: req.originalUrl,

          status: res.statusCode,

          latency

        }

      });

    }

    catch (error) {

      logger.error(

        "Failed to record telemetry",

        error

      );

    }

  });

  next();

}
