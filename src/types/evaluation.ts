/**
 * ============================================================================
 * KZDI Talent OS Enterprise v3.0
 * KZDI Intelligence Gateway (KIG)
 * ----------------------------------------------------------------------------
 * File: src/types/evaluation.ts
 *
 * Canonical Evaluation Domain Types
 *
 * This file defines the shared data model used throughout the platform.
 * ============================================================================
 */

import type { AIProviderName } from "../ai/provider";

/**
 * Supported Talent Tracks
 */
export type TalentTrack =
  | "ml_engineering"
  | "nlp_specialization"
  | "data_infrastructure"
  | "full_stack_development";

/**
 * Candidate Profile
 */
export interface Candidate {

  id?: string;

  name: string;

  skills: string[];

  experience: string;

  languages: string[];

  community?: string;

  goal?: string;

}

/**
 * Individual Track Score
 */
export interface TrackScore {

  name: TalentTrack;

  confidence: number;

}

/**
 * AI Recommendation
 */
export interface Recommendation {

  top_track: TalentTrack;

  recommendation: string;

  reasoning: string;

}

/**
 * AI Metadata
 */
export interface EvaluationMetadata {

  provider: AIProviderName;

  model: string;

  request_id: string;

  trace_id?: string;

  latency_ms: number;

  retries: number;

  timestamp: string;

}

/**
 * Complete Evaluation
 */
export interface Evaluation {

  candidate: Candidate;

  tracks: TrackScore[];

  recommendation: Recommendation;

  metadata: EvaluationMetadata;

}

/**
 * Database Record
 */
export interface EvaluationRecord {

  id?: string;

  candidate_id: string;

  ml_engineering_confidence: number;

  nlp_specialization_confidence: number;

  data_infrastructure_confidence: number;

  full_stack_confidence: number;

  top_track: TalentTrack;

  recommendation: string;

  reasoning: string;

  provider: AIProviderName;

  model: string;

  request_id: string;

  latency_ms: number;

  created_at: string;

}

/**
 * Telemetry Event
 */
export interface EvaluationTelemetry {

  event: "evaluation_completed" | "evaluation_failed";

  provider: AIProviderName;

  model: string;

  request_id: string;

  trace_id?: string;

  latency_ms: number;

  retries: number;

  success: boolean;

  timestamp: string;

}

/**
 * Health Check
 */
export interface ProviderHealth {

  provider: AIProviderName;

  healthy: boolean;

  latency_ms: number;

  message: string;

}

/**
 * Generic API Response
 */
export interface APIResponse<T> {

  success: boolean;

  data?: T;

  error?: string;

  request_id: string;

  timestamp: string;

}
