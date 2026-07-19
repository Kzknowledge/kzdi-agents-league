/**
 * ============================================================================
 * KZDI Talent OS Enterprise v3.0
 * Request ID Middleware
 * ----------------------------------------------------------------------------
 * File: src/middleware/requestId.ts
 *
 * Responsibilities
 * - Generate Request IDs
 * - Generate Trace IDs
 * - Correlation support
 * - Distributed tracing
 * ============================================================================
 */

import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

/**
 * Extend Express Request
 */
declare global {
  namespace Express {
    interface Request {
      requestId: string;
      traceId: string;
      startedAt: number;
    }
  }
}

/**
 * Generate UUID
 */
function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Request ID Middleware
 */
export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {

  const requestId =
    (req.headers["x-request-id"] as string) ??
    generateId();

  const traceId =
    (req.headers["x-trace-id"] as string) ??
    generateId();

  req.requestId = requestId;
  req.traceId = traceId;
  req.startedAt = Date.now();

  res.setHeader("X-Request-ID", requestId);
  res.setHeader("X-Trace-ID", traceId);

  next();
}

/**
 * Get current Request ID
 */
export function getRequestId(req: Request): string {
  return req.requestId;
}

/**
 * Get current Trace ID
 */
export function getTraceId(req: Request): string {
  return req.traceId;
}
