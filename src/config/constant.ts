/**
 * ============================================================================
 * KZDI Talent OS Enterprise v3.0
 * ----------------------------------------------------------------------------
 * File: src/config/constants.ts
 *
 * Enterprise Application Constants
 *
 * This file contains immutable platform constants used throughout the
 * application.
 *
 * DO NOT store secrets here.
 * ============================================================================
 */

export const APP = Object.freeze({
  NAME: "KZDI Talent OS",
  VERSION: "3.0.0",
  ORGANIZATION: "Kimiyyar Zahiri Digital Intelligence (KZDI)",
  AI_GATEWAY: "KZDI Intelligence Gateway",
  API_VERSION: "v1"
});

export const HTTP = Object.freeze({
  REQUEST_TIMEOUT_MS: 30000,
  MAX_REQUEST_SIZE: "10mb",
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100
});

export const AI = Object.freeze({
  DEFAULT_PROVIDER: "gemini",

  DEFAULT_MODEL: "gemini-2.5-pro",

  DEFAULT_TEMPERATURE: 0.3,

  DEFAULT_MAX_TOKENS: 1000,

  MAX_RETRIES: 3,

  RETRY_DELAY_MS: 1000
});

export const EVALUATION = Object.freeze({
  TRACKS: [
    "ml_engineering",
    "nlp_specialization",
    "data_infrastructure",
    "full_stack_development"
  ] as const,

  MIN_CONFIDENCE: 0,

  MAX_CONFIDENCE: 1
});

export const DATABASE = Object.freeze({
  TABLES: {

    CANDIDATES: "candidates",

    EVALUATIONS: "evaluations",

    TELEMETRY: "telemetry_events"

  }
});

export const TELEMETRY = Object.freeze({

  EVENT_TYPES: {

    AI_REQUEST: "ai_request",

    AI_RESPONSE: "ai_response",

    AI_ERROR: "ai_error",

    EVALUATION_CREATED: "evaluation_created",

    DATABASE_WRITE: "database_write"

  }

});

export const LOG_LEVELS = Object.freeze({

  DEBUG: "debug",

  INFO: "info",

  WARN: "warn",

  ERROR: "error"

});

export const HEALTH = Object.freeze({

  STATUS: {

    HEALTHY: "healthy",

    DEGRADED: "degraded",

    UNHEALTHY: "unhealthy"

  }

});

export const HEADERS = Object.freeze({

  REQUEST_ID: "x-request-id",

  TRACE_ID: "x-trace-id",

  CONTENT_TYPE: "Content-Type"

});

export const CONTENT_TYPES = Object.freeze({

  JSON: "application/json"

});

export const ERROR_CODES = Object.freeze({

  VALIDATION_ERROR: "VALIDATION_ERROR",

  PROVIDER_ERROR: "PROVIDER_ERROR",

  DATABASE_ERROR: "DATABASE_ERROR",

  CONFIGURATION_ERROR: "CONFIGURATION_ERROR",

  INTERNAL_ERROR: "INTERNAL_ERROR"

});
