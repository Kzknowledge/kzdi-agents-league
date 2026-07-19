/**
 * ============================================================================
 * KZDI Talent OS Enterprise v3.0
 * KZDI Intelligence Gateway (KIG)
 * ----------------------------------------------------------------------------
 * File: src/ai/validator/responseValidator.ts
 *
 * Enterprise AI Response Validator
 *
 * Responsibilities
 * - Extract JSON from AI responses
 * - Remove Markdown code fences
 * - Parse JSON safely
 * - Validate against schema
 * - Normalize values
 * - Return canonical evaluation
 * ============================================================================
 */

import {
  EvaluationResponse,
  validateAIResponse
} from "../schemas/evaluation.schema";

import { createLogger } from "../../config/logger";

const logger = createLogger("AIValidator");

/**
 * Validation Error
 */
export class AIValidationError extends Error {

  constructor(message: string) {
    super(message);
    this.name = "AIValidationError";
  }

}

/**
 * Extract JSON from AI response.
 */
export function extractJSON(
  content: string
): string {

  const trimmed = content.trim();

  // Already JSON
  if (
    trimmed.startsWith("{") &&
    trimmed.endsWith("}")
  ) {
    return trimmed;
  }

  // Remove Markdown code fences
  const cleaned = trimmed
    .replace(/^```json/i, "")
    .replace(/^```/i, "")
    .replace(/```$/i, "")
    .trim();

  if (
    cleaned.startsWith("{") &&
    cleaned.endsWith("}")
  ) {
    return cleaned;
  }

  // Attempt to locate first JSON object
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start >= 0 && end > start) {
    return cleaned.substring(start, end + 1);
  }

  throw new AIValidationError(
    "Unable to locate valid JSON in AI response."
  );

}

/**
 * Normalize confidence values.
 */
function normalizeEvaluation(
  evaluation: EvaluationResponse
): EvaluationResponse {

  return {

    ...evaluation,

    tracks: evaluation.tracks.map(track => ({

      ...track,

      confidence: Number(
        Math.min(
          1,
          Math.max(0, track.confidence)
        ).toFixed(3)
      )

    }))

  };

}

/**
 * Parse AI response.
 */
export function parseAIResponse(
  raw: string
): EvaluationResponse {

  try {

    const json = extractJSON(raw);

    const parsed = JSON.parse(json);

    const validated =
      validateAIResponse(parsed);

    return normalizeEvaluation(
      validated
    );

  } catch (error) {

    logger.error(
      "AI response validation failed",
      error
    );

    if (error instanceof AIValidationError) {
      throw error;
    }

    throw new AIValidationError(
      error instanceof Error
        ? error.message
        : "Unknown validation error."
    );

  }

}

/**
 * Safe parser.
 */
export function safeParseAIResponse(
  raw: string
): {
  success: boolean;
  data?: EvaluationResponse;
  error?: string;
} {

  try {

    return {

      success: true,

      data: parseAIResponse(raw)

    };

  } catch (error) {

    return {

      success: false,

      error:
        error instanceof Error
          ? error.message
          : "Unknown validation error."

    };

  }

}

/**
 * Validate provider response.
 */
export function validateProviderResponse(
  response: unknown
): EvaluationResponse {

  if (
    typeof response !== "string"
  ) {
    throw new AIValidationError(
      "Provider response must be a string."
    );
  }

  return parseAIResponse(response);

}
