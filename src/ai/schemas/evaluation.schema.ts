/**
 * ============================================================================
 * KZDI Talent OS Enterprise v3.0
 * KZDI Intelligence Gateway (KIG)
 * ----------------------------------------------------------------------------
 * File: src/ai/schemas/evaluation.schema.ts
 *
 * Enterprise AI Evaluation Schema
 *
 * Responsibilities
 * - Validate AI responses
 * - Infer TypeScript types
 * - Enforce business rules
 * - Prevent malformed AI output
 * ============================================================================
 */

import { z } from "zod";

/**
 * Supported Talent Tracks
 */
export const TalentTrackSchema = z.enum([
  "ml_engineering",
  "nlp_specialization",
  "data_infrastructure",
  "full_stack_development"
]);

/**
 * Confidence Score
 */
export const ConfidenceSchema = z
  .number()
  .min(0)
  .max(1);

/**
 * Individual Track
 */
export const TrackSchema = z.object({

  name: TalentTrackSchema,

  confidence: ConfidenceSchema

});

/**
 * Recommendation
 */
export const RecommendationSchema = z
  .string()
  .min(10)
  .max(500);

/**
 * Reasoning
 */
export const ReasoningSchema = z
  .string()
  .min(20)
  .max(2000);

/**
 * Complete Evaluation Schema
 */
export const EvaluationSchema = z.object({

  tracks: z
    .array(TrackSchema)
    .length(4),

  top_track: TalentTrackSchema,

  recommendation: RecommendationSchema,

  reasoning: ReasoningSchema

});

/**
 * Parsed Evaluation Type
 */
export type EvaluationResponse =
  z.infer<typeof EvaluationSchema>;

/**
 * Validate AI response.
 */
export function validateEvaluation(
  input: unknown
): EvaluationResponse {

  return EvaluationSchema.parse(input);

}

/**
 * Safe validation.
 */
export function safeValidateEvaluation(
  input: unknown
) {

  return EvaluationSchema.safeParse(input);

}

/**
 * Ensure all four talent tracks exist.
 */
export function hasAllTracks(
  evaluation: EvaluationResponse
): boolean {

  const required = [

    "ml_engineering",

    "nlp_specialization",

    "data_infrastructure",

    "full_stack_development"

  ];

  const actual =
    evaluation.tracks.map(
      track => track.name
    );

  return required.every(
    track => actual.includes(track as any)
  );

}

/**
 * Validate confidence totals.
 */
export function confidenceWithinRange(
  evaluation: EvaluationResponse
): boolean {

  return evaluation.tracks.every(

    track =>

      track.confidence >= 0 &&

      track.confidence <= 1

  );

}

/**
 * Enterprise Validation
 */
export function validateBusinessRules(
  evaluation: EvaluationResponse
): void {

  if (!hasAllTracks(evaluation)) {

    throw new Error(
      "AI response is missing one or more required talent tracks."
    );

  }

  if (!confidenceWithinRange(evaluation)) {

    throw new Error(
      "Confidence values must be between 0 and 1."
    );

  }

  const topTrackExists =
    evaluation.tracks.some(

      track =>

        track.name === evaluation.top_track

    );

  if (!topTrackExists) {

    throw new Error(
      "top_track does not match any evaluated track."
    );

  }

}

/**
 * Canonical Validation
 */
export function validateAIResponse(
  input: unknown
): EvaluationResponse {

  const evaluation =
    validateEvaluation(input);

  validateBusinessRules(
    evaluation
  );

  return evaluation;

}
