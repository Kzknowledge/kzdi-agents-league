/**
 * ============================================================================
 * KZDI Talent OS Enterprise v3.0
 * Global Error Handler
 * ----------------------------------------------------------------------------
 * File: src/middleware/errorHandler.ts
 *
 * Responsibilities
 * - Standardize API error responses
 * - Categorize operational errors
 * - Log unexpected failures
 * - Prevent internal stack leakage
 * ============================================================================
 */

import { Request, Response, NextFunction } from "express";
import { createLogger } from "../config/logger";

const logger = createLogger("ErrorHandler");

/**
 * Standard API Error
 */
export class AppError extends Error {

  public readonly statusCode: number;

  public readonly code: string;

  public readonly operational: boolean;

  constructor(
    message: string,
    statusCode = 500,
    code = "INTERNAL_SERVER_ERROR",
    operational = true
  ) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.operational = operational;

    Error.captureStackTrace(this, this.constructor);
  }

}

/**
 * Validation Error
 */
export class ValidationError extends AppError {

  constructor(message: string) {

    super(
      message,
      400,
      "VALIDATION_ERROR"
    );

  }

}

/**
 * Authentication Error
 */
export class AuthenticationError extends AppError {

  constructor(message = "Authentication required") {

    super(
      message,
      401,
      "AUTHENTICATION_ERROR"
    );

  }

}

/**
 * Authorization Error
 */
export class AuthorizationError extends AppError {

  constructor(message = "Access denied") {

    super(
      message,
      403,
      "AUTHORIZATION_ERROR"
    );

  }

}

/**
 * Not Found Error
 */
export class NotFoundError extends AppError {

  constructor(message = "Resource not found") {

    super(
      message,
      404,
      "NOT_FOUND"
    );

  }

}

/**
 * AI Provider Error
 */
export class AIProviderError extends AppError {

  constructor(message: string) {

    super(
      message,
      502,
      "AI_PROVIDER_ERROR"
    );

  }

}

/**
 * Global Express Error Middleware
 */
export function errorHandler(

  err: Error,

  req: Request,

  res: Response,

  next: NextFunction

) {

  logger.error("Unhandled exception", {

    metadata: {

      path: req.originalUrl,

      method: req.method,

      message: err.message,

      stack: process.env.NODE_ENV === "development"
        ? err.stack
        : undefined

    }

  });

  if (err instanceof AppError) {

    return res.status(err.statusCode).json({

      success: false,

      error: {

        code: err.code,

        message: err.message

      },

      timestamp: new Date().toISOString()

    });

  }

  return res.status(500).json({

    success: false,

    error: {

      code: "INTERNAL_SERVER_ERROR",

      message:
        process.env.NODE_ENV === "development"
          ? err.message
          : "An unexpected error occurred."

    },

    timestamp: new Date().toISOString()

  });

          }
